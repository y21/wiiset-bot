import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import Lobby, { LobbyOptions } from '../ttc/lobby';
import { hasOption, formatConstantKey } from '../utils/utils';
import { Message } from 'detritus-client/lib/structures';
import { TTC_VERSION, NUMBER_EMOJIS } from '../utils/constants';
import { AiDifficulty } from '../ttc/user';
import { Response } from 'node-fetch';

interface UserData {
    options: number;
    response: Message,
    client: Client,
    context: Context
}

const MAX_ROUNDS = 7; // 1 << 7 = 128

const CPU_REACTIONS = Object.fromEntries(
    [
        'EASY',
        'MEDIUM',
        'HARD',
        'EXPERT',
        'RANDOM',
        'RANDOMIZE_ALL',
        'STOP'
    ].map((x, i) => [x, NUMBER_EMOJIS[i]])
);

const TEAM_REACTIONS = Object.fromEntries(
    [
        '2v2',
        '3v3',
        '4v4',
        '6v6'
    ].map((x, i) => [x, NUMBER_EMOJIS[i]])
);

export default <Cmd>{
    name: 'ttc createlobby',
    ownerOnly: false,
    metadata: {
        description: 'Creates a TTC Lobby'
    },
    onrun: async function(client, context, args) {
        const fargs: Array<string> = args[this.name]?.split(' ') ?? [];
        if (args.length < 1) {
            throw new Error('Invalid lobby options.');
        }

        let options: number;

        if (fargs[0] === 'random') {
            options = Lobby.randomizeOptions();
        } else {
            const fmtOptions = fargs
                .join('')
                .split(/, */g)
                .filter(x => LobbyOptions[x]);

            if (fmtOptions.length < 1) {
                throw new Error('Option(s) not found.');
            }

            options = fmtOptions.reduce((a, b) => (+a) | (+LobbyOptions[b]), 0);
        }

        const response = await context.reply('Creating lobby...');
        await createLobby({ options, response, client, context });
    }
}

function buildCpuMessage(idx: number) {
    return {
        embed: {
            color: 0x2ecc71,
            title: `TT-Competition ${TTC_VERSION} | CPU #${idx + 1}`,
            description: 'React with one of the emojis below to set the difficulty for this CPU\n' +
                Object.entries(CPU_REACTIONS).map(([k, v]) => v + ' ' + formatConstantKey(k)).join('\n')
        }
    };
}

function handleBots({ client, context, response }: UserData): Promise<Array<number>> {
    return new Promise(async (resolve) => {
        await response.edit({
            ...buildCpuMessage(0),
            content: undefined
        });

        const botDiffs: Array<number> = [];
        const paginator = await client.paginator.createReactionPaginator({
            message: context.message,
            commandMessage: response,
            reactions: CPU_REACTIONS
        });

        paginator.on('raw', (data) => {
            const { emoji } = data;

            switch (emoji.name) {
                case CPU_REACTIONS.EASY:
                    botDiffs.push(AiDifficulty.EASY);
                    break;
                case CPU_REACTIONS.MEDIUM:
                    botDiffs.push(AiDifficulty.MEDIUM);
                    break;
                case CPU_REACTIONS.HARD:
                    botDiffs.push(AiDifficulty.HARD);
                    break;
                case CPU_REACTIONS.EXPERT:
                    botDiffs.push(AiDifficulty.EXPERT);
                    break;
                case CPU_REACTIONS.RANDOM:
                    botDiffs.push(Lobby.randomizeSingleBotDiff());
                    break;
                case CPU_REACTIONS.RANDOMIZE_ALL:
                    const count = ~~(Math.random() * (Lobby.BOTS_LIMIT - botDiffs.length));
                    botDiffs.push(...Lobby.randomBotDiffs(count));
                    break;
                case CPU_REACTIONS.STOP:
                    paginator.stop();
                    return resolve(botDiffs);
            }

            if (botDiffs.length >= Lobby.BOTS_LIMIT) {
                paginator.stop();
                return resolve(botDiffs);
            }

            response.edit({
                ...buildCpuMessage(botDiffs.length),
                content: undefined
            })
        });
    });
}

function handleTeams({ client, context, response }: UserData): Promise<number> {
    return new Promise(async (resolve) => {
        await response.edit({
            embed: {
                color: 0x2ecc71,
                title: `TT-Competition ${TTC_VERSION} | Team size`,
                description: 'React with one of the emojis below to set the team size for this lobby\n' +
                    Object.entries(TEAM_REACTIONS).map(([k, v]) => `${v} ${k}`).join('\n')
            },
            content: undefined
        });

        const paginator = await client.paginator.createReactionPaginator({
            message: context.message,
            commandMessage: response,
            reactions: TEAM_REACTIONS
        });

        paginator.on('raw', (data) => {
            const { emoji } = data;

            switch (emoji.name) {
                case TEAM_REACTIONS['2v2']:
                    resolve(LobbyOptions.Teams2);
                    break;
                case TEAM_REACTIONS['3v3']:
                    resolve(LobbyOptions.Teams3);
                    break;
                case TEAM_REACTIONS['4v4']:
                    resolve(LobbyOptions.Teams4);
                    break;
                case TEAM_REACTIONS['6v6']:
                    resolve(LobbyOptions.Teams6);
                    break;
            }

            paginator.stop();
        });
    });
}

function handleRounds({ client, context, response }: UserData) {
    return new Promise<number>(async (resolve) => {
        await response.edit({
            embed: {
                color: 0x2ecc71,
                title: `TT-Competition ${TTC_VERSION} | Number of rounds`,
                description: 'React with one of the emojis below to set the maximum number of rounds\n' +
                    Object.entries(TEAM_REACTIONS).map(([k, v]) => `${v} ${k}`).join('\n')
            },
            content: undefined
        });

        const paginator = await client.paginator.createReactionPaginator({
            message: context.message,
            commandMessage: response,
            reactions: Object.fromEntries(
                NUMBER_EMOJIS.slice(0, MAX_ROUNDS)
                    .map(x => [x, x])
            )
        });

        paginator.on('raw', (data) => {
            const { emoji } = data;
            
            const idx = NUMBER_EMOJIS.indexOf(emoji.name);
            if (idx < 0 || idx + 1 > MAX_ROUNDS) return;

            resolve(1 << (idx + 1));
            paginator.stop();
        });
    });
}

async function sendOrEditLobbyMessage(lobby: Lobby, data: UserData) {
    const { context, client } = data;

    // Attempt to send password to message author (if private)
    if (hasOption(data.options, LobbyOptions.Private)) {
        try {
            await context.message.author.createMessage(
                `🔒 Password for lobby: __${lobby.password}__. This is required for people to join this lobby because it has been marked as **private**.`
            );
        } catch {
            await client.restClient.ttc.removePlayerFromLobby(lobby.id, context.userId, context.channelId);
            return context.reply(`<@${context.userId}> could not send the lobby password in direct messages. Please enable \`Allow direct messages from server members\`. https://i.imgur.com/7N0zBK0.gif`);
        }
    }

    const messageData = {
        embed: {
            color: 0x2ecc71,
            description: 'Successfully created lobby!',
            fields: [
                {
                    name: 'Lobby ID',
                    value: String(lobby.id) || '-'
                },
                {
                    name: 'Lobby Options',
                    value: Lobby.formatOptions(lobby.options) || '-'
                }
            ]
        }
    };

    if (hasOption(lobby.options, LobbyOptions.Teams)) {
        messageData.embed.fields.push({
            name: 'Teams',
            value: lobby.teamsToString() || '-'
        });
    }

    if (data.response) {
        await data.response.edit({
            ...messageData,
            content: undefined
        });
    } else {
        await context.reply(messageData);
    }
}

async function createLobby(userData: UserData) {
    console.log(userData.options);
    const { context, client } = userData;

    let botDiffs: Array<number> | undefined = undefined, maxRounds = undefined;

    if (hasOption(userData.options, LobbyOptions.Bots)) {
        console.log('bots', userData.options);
        botDiffs = await handleBots(userData);
    }

    if (hasOption(userData.options, LobbyOptions.Teams)) {
        console.log('teams', userData.options);
        userData.options |= await handleTeams(userData);
    }

    if (hasOption(userData.options, LobbyOptions.Elimination)) {
        console.log('elimination', userData.options);
        maxRounds = await handleRounds(userData);
    }

    let data: Lobby;

    try {
        data = await client.restClient.ttc.createLobby(
            context.userId,
            context.channelId,
            {
                options: userData.options,
                aiDiffs: botDiffs,
                maxRounds: maxRounds
            }
        );
    } catch(e) {
        console.log('error', e);
        await userData.response.edit({
            content: e.message,
            embed: null
        });
        return;
    }

    
    console.log('end');
    await sendOrEditLobbyMessage(data, userData);
}