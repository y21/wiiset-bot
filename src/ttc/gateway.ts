import { Client } from '../client';
import * as ttcConfig from '../../configs/ttc.json';
import WebSocket from 'ws';
import * as Types from './types';
import { ChannelDM } from 'detritus-client/lib/structures';
import {
    SNOWFLAKE_REGEX, TTC_VERSION, NUMBER_EMOJIS, MEDALS
} from '../utils/constants';
import {
    timeSecondsToString, TableData, generateTable, calculatePoints
} from '../utils/utils';
import { Markup } from 'detritus-client/lib/utils';
import * as User from './user';

function makeWebSocketUrl() {
    return (ttcConfig.ssl ? 'wss' : 'ws') + '://' + ttcConfig.host + ttcConfig.wsRoute;
}

function isValidMessageData(obj: {
    content?: string,
    embed?: any
}) {
    const hop = Object.prototype.hasOwnProperty.bind(obj);
    
    return hop('content') || hop('embed');
}

export class Gateway {
    private client: Client;
    private connection?: WebSocket;

    constructor(client: Client) {
        this.client = client;

        this.makeConnection();
    }

    private makeConnection() {
        if (this.connection) {
            this.connection.removeAllListeners();
        }

        this.connection = new WebSocket(makeWebSocketUrl());
        this.connection.on('close', () => this.onclose());
        this.connection.on('error', console.error);
        this.connection.on('open', () => this.identify());
        this.connection.on('message', (data) => this.onmessage(data));
    }

    private send<T = any>(data: T) {
        this.connection?.send(typeof data === 'string' ? data : JSON.stringify(data));
    }

    private identify() {
        this.send({
            t: 'IDENTIFY',
            d: {
                key: ttcConfig.token
            }
        });
    }

    private onclose() {
        setTimeout(() => this.makeConnection(), 10000);
    }

    private async handleTrackSelection(payload: Types.GatewayPayload<Types.LobbyTrackSelectionData>) {
        const tracks: Array<string> = payload.data.tracks.map(x => x.name);
        const reactions = Object.fromEntries(
            tracks.map((x, i) => [ x, NUMBER_EMOJIS[i] ])
        );

        const data = {
            embed: {
                description: Types.Texts.VOTE_FOR_TRACK + tracks
                    .map((x, i) => `${NUMBER_EMOJIS[i]} ${x}`)
                    .join('\n')
            }
        };

        const voteMessages = await Promise.all(
            payload.recipients?.map(x => this.client.commandClient.rest.createMessage(x, data)) ?? []
        );

        const paginator = await this.client.paginator.createReactionPaginator({
            // @ts-ignore
            message: {
                // Hacky solution
                // We don't have a message here, so we just use the current timestamp
                id: String(Date.now())
            },
            reactions,
            targetUser: new Set(payload.data.users.map(x => x.userid)),
            commandMessage: new Map(voteMessages.map(x => [x.id, x])),
            maxTime: 60_000
        });

        const votes: Map<string, Array<string>> = new Map;

        paginator.on('raw', paginatorData => {
            const { emoji } = paginatorData;

            const vote = tracks[NUMBER_EMOJIS.indexOf(emoji.name)];

            const users = votes.get(vote) ?? [];

            // User has already voted for this track, ignore
            if (users.includes(paginatorData.user_id)) return;

            votes.set(vote, users.concat(paginatorData));
        });

        paginator.on('stop', async () => {
            const [track, users] = Array.from(votes.entries())
                .sort((a, b) => b[1].length - a[1].length)[0];

            try {
                await this.client.restClient.ttc.forceTrack(
                    payload.data.lobbyID,
                    track
                );

                await paginator.update({
                    embed: null,
                    content: `Track ${track} (${users.length} votes)`
                })
            } catch(e) {
                await paginator.update({
                    embed: null,
                    content: e.message
                });
            }
        });
    }

    private async handleNewTrack(payload: Types.GatewayPayload<Types.LobbyStateChangeData>) {
        return {
            embed: {
                description: Types.Texts.PREPARATION
                    .replace('{track}', payload.data.message)
                    .replace('{time}', timeSecondsToString(payload.data.wrTime))
            }
        };
    }

    private async handleThresholdReached() {
        return {
            embed: {
                description: Types.Texts.THRESHOLD_REACHED
            }
        };
    }

    private async handleGameStart() {
        return {
            embed: {
                description: Types.Texts.INGAME_PHASE
            }
        };
    }

    private async handleRoundEnd(payload: Types.GatewayPayload<Types.RoundEndData>) {
        const table = await this.generateResultsTable(
            payload.data.remainingPlayers.concat(payload.data.eliminated),
            payload.data.wrTime,
            {
                end: false,
                isTeamsMode: false
            }
        );

        return {
            embed: {
                fields: [
                    {
                        name: 'Top ghosts for this round',
                        value: Markup.codeblock(table || 'No ghosts found', {
                            language: 'js'
                        }) + 'Note: Times marked with * were manually added.'
                    },
                    {
                        name: 'Eliminated',
                        value: payload.data.eliminated
                            .map(x => {
                                let displayName;
                                if (x.aiDiff !== User.AiDifficulty.DISABLED) {
                                    displayName = User.default.buildAIName(
                                        x.userid, x.aiDiff
                                    );
                                } else {
                                    displayName = `<@${x.userid}>`;
                                }

                                return displayName;
                            })
                            .join('\n') || 'No players have been eliminated'
                    }
                ]
            }
        }
    }

    private async handleLobbbyEnd(payload: Types.GatewayPayload) {
        const players: Array<any> = !payload.data.isTeamsMode ? payload.data.users : Object.values(payload.data.users);
        const table = await this.generateResultsTable(
            players.slice(0, 10),
            null,
            {
                end: true,
                isTeamsMode: payload.data.isTeamsMode
            }
        );

        return {
            embed: {
                description: Types.Texts.LOBBY_END + Markup.codeblock(
                    table,
                    {
                        language: 'js'
                    }
                )
            }
        }
    }

    private async handleLobbyWarning(payload: Types.GatewayPayload) {
        const {
            remaining,
            warnCount
        } = payload.data;
        let timeF: string, text: string;

        if (remaining < 60) {
            timeF = `${remaining} seconds`;
        } else {
            timeF = `${(remaining / 60).toFixed(1)} minutes`;
        }

        if (warnCount >= 2) {
            text = Types.Texts.LOBBY_TIME_WARNING_LAST;
        } else {
            text = Types.Texts.LOBBY_TIME_WARNING;
        }

        return {
            embed: {
                description: text.replace('{time}', timeF)
            }
        }
    }

    private async handleInvalidGhost(payload: Types.GatewayPayload) {
        if (!payload.recipients) return;
        const dmChannel: ChannelDM = await this.client.commandClient.rest.fetchUser(payload.recipients[0])
            .then(x => x.createOrGetDm());

        try {
            await dmChannel.createMessage({
                embed: {
                    title: `TT-Competition ${TTC_VERSION}`,
                    description: 'One of your submitted ghosts were not found and points gained from that round have been removed from your profile.\n' +
                        'If you think this is a mistake, please join the [TTC Server](https://discord.gg/BnFax3Z)\n',
                    fields: [{
                            name: 'Track',
                            value: payload.data.track ?? '?'
                        },
                        {
                            name: 'Time',
                            value: timeSecondsToString(payload.data.time) ?? '?'
                        },
                        {
                            name: 'Lobby ID',
                            value: payload.data.lobby ?? '?'
                        }
                    ]
                }
            });
        } catch(e) {
            console.log(e);
        }
    }

    private async onmessage(data: WebSocket.Data) {
        if (typeof data !== 'string') {
            throw new Error('data is not of type string');
        }

        const payload: Types.GatewayPayload = JSON.parse(data);

        if (payload.recipients) {
            payload.recipients = payload.recipients.filter(x => SNOWFLAKE_REGEX.test(x));
        }

        let messageData;

        switch (payload.type) {
            case Types.EventType.TrackSelection:
                messageData = await this.handleTrackSelection(payload);
                break;
            case Types.EventType.NewTrack:
                messageData = await this.handleNewTrack(payload);
                break;
            case Types.EventType.ThresholdReached:
                messageData = await this.handleThresholdReached();
                break;
            case Types.EventType.GameStart:
                messageData = await this.handleGameStart();
                break;
            case Types.EventType.RoundEnd:
                messageData = await this.handleRoundEnd(payload);
                break;
            case Types.EventType.LobbyEnd:
                messageData = await this.handleLobbbyEnd(payload);
                break;
            case Types.EventType.LobbyWarning:
                messageData = await this.handleLobbyWarning(payload);
                break;
            case Types.EventType.InvalidGhost:
                messageData = await this.handleInvalidGhost(payload);
                break;
        }

        if (messageData && payload.recipients && isValidMessageData(messageData)) {
            for (const recipient of payload.recipients) {
                await this.client.commandClient.rest.createMessage(
                    recipient,
                    messageData
                );
            }
        }
    }

    public async generateResultsTable(
        players: Array<User.Player | Types.Team>,
        wrTime: number | null,
        data: { end: boolean, isTeamsMode: boolean }
    ): Promise<string> {
        let tableData: TableData = {
            header: [
                '#',
                data.isTeamsMode && data.end ? 'Team' : 'Player'
            ],
            rows: [],
            offset: 4
        }

        let fastestGhosts = players;

        if (data.end && !data.isTeamsMode) {
            fastestGhosts = fastestGhosts
                .sort((a, b) => b.points - a.points);

            tableData.header.push('Pts');
        } else if (data.end && data.isTeamsMode) {
            for (const team of fastestGhosts) {
                team.points = (<Types.Team>team).players
                    .reduce((prev, cur) => prev + cur.points, 0);
            }
            
            fastestGhosts = fastestGhosts.sort((a, b) => b.points - a.points);
            tableData.header.push('Pts');
        } else {
            fastestGhosts = (<Array<User.Player>>fastestGhosts)
                .sort((a, b) => a.ghost.timeSeconds - b.ghost.timeSeconds);
            tableData.header.push('Time', 'Pts');
        }

        for (let i = 0; i < fastestGhosts.length; ++i) {
            const cur = fastestGhosts[i], curUser = <User.Player>cur;
            let tag: string, finishTime = '', points = String(cur.points | 0);

            if (!data.isTeamsMode) {
                if (curUser.aiDiff === User.AiDifficulty.DISABLED) {
                    tag = await this.client.commandClient.rest.fetchUser(curUser.userid)
                        .then(x => x.username);
                    finishTime = timeSecondsToString(curUser.ghost.timeSeconds);
                } else {
                    tag = User.default.buildAIName(curUser.userid, curUser.aiDiff);
                }
            } else {
                tag = `Team ${(<Types.Team>cur).id}`;
                // points = cur.points;
            }

            if (!data.end) {
                if (curUser.ghost.timeSeconds > 360) {
                    // No ghost submitted
                    finishTime = '-';
                    points += ' (+0)';
                } else {
                    points += ` (+${calculatePoints(curUser.ghost.timeSeconds - (wrTime ?? 0))})`;
                }

                if (curUser.ghost.customGhost) {
                    // Add * if this is a custom ghost
                    finishTime += ' (*)';
                }

                tableData.rows.push([ MEDALS[i] ?? i + 1, tag, finishTime, points ]);
            } else {
                tableData.rows.push([ MEDALS[i] ?? i + 1, tag, points ]);
            }
        }

        return generateTable(tableData);
    }
}