const PersistentWebSocket = require("pws");
const WebSocket = require("ws");
const { ttcWS } = require("../../../configs/apis");
const { ttcToken } = require("../../../configs/bot");
const User = require("./User");
const Logger = require("../Logger");
const AsciiTable = require("ascii-table");
const Version = "1.0-beta";
const { Regexes } = require("../Constants");
let Lobby = require("./Lobby");

const Events = {
    ThresholdReached: 1 << 0,
    NewTrack: 1 << 1,
    GameStart: 1 << 2,
    RoundEnd: 1 << 3,
    LobbyWarning: 1 << 4,
    LobbyEnd: 1 << 5,
    UserRankUpdate: 1 << 6
};

const LobbyStates = {
    Waiting: 1 << 0,
    ThresholdReached: 1 << 1,
    MapPick: 1 << 2,
    Preparation: 1 << 3,
    Ingame: 1 << 4,
    Upload: 1 << 5
};

const Medals = [ "🥇", "🥈", "🥉" ];

const Texts = {
    PreparationPhase: "ℹ️ Preparation phase has started. Boot up Mario Kart Wii and complete a ghost on {track}.\nWorld Record: {time}",
    ThresholdPhase: "⏱️ Minimum number of players for this lobby has been reached, waiting 30 more seconds for more players to join...",
    IngamePhase: "🏎️ Ingame phase has started! Make sure to upload a ghost to the ghost database on the selected track within the next 15 minutes.",
    LobbyTimeWarning: "⚠️ {time} left!",
    LobbyEnd: "✅ Lobby has ended! Results:\n\n"
};
Texts.LobbyTimeWarningLast = Texts.LobbyTimeWarning + " Please make sure to upload a ghost to the ghost database.";

module.exports = class TTCGateway {
    constructor(bot) {
        Lobby = require("./Lobby");
        this.bot = bot;
        this.connection = new PersistentWebSocket(ttcWS, WebSocket);
        this.ready = false;
    }

    identify() {
        this.connection.send(JSON.stringify({
            t: "IDENTIFY",
            d: { key: ttcToken }
        }));
    }

    init() {
        this.connection.onopen = () => this.identify();

        this.connection.onclose = () => {
            this.ready = false;
        };

        this.connection.onmessage = async ({ data: event }) => {
            let message;
            try {
                message = JSON.parse(event);
            } catch(e) {
                return Logger.error(e.message);
            }

            if (message.recipients) {
                message.recipients = message.recipients.filter(r => Regexes.Snowflake.test(r));
            }

            const messageData = {
                embed: {
                    title: `TT-Competition ${Version}`,
                    color: 0xff7979,
                    footer: {
                        text: `Lobby ID: ${message.data.lobbyID}`
                    }
                }
            }

            switch(message.type) {
                case Events.NewTrack:
                    messageData.embed.description = Texts.PreparationPhase
                        .replace("{track}", message.data.message)
                        .replace("{time}", timeSecondsToString(message.data.wrTime));
                break;
                case Events.ThresholdReached:
                    messageData.embed.description = Texts.ThresholdPhase;
                break;
                case Events.GameStart:
                    messageData.embed.description = Texts.IngamePhase;
                break;
                case Events.RoundEnd: {
                    const table = await this.generateResultsTable(message.data.remainingPlayers.concat(message.data.eliminated), message.data.wrTime, {
                        end: false,
                        isTeamsMode: false
                    });

                    messageData.embed.fields = [
                        {
                            name: "Top ghosts for this round",
                            value: "```js\n" + (table.toString().trim() || "No ghosts found") + "\n```"
                        },
                        {
                            name: "Eliminated",
                            value: message.data.eliminated
                                .map((v) => `${v.aiDiff !== User.AiDifficulty.DISABLED ? User.buildAIName(v.userid, v.aiDiff) : `<@${v.userid}>`} (${v.total_rating + v.base_rating}R)`)
                                .join("\n") || "No players have been eliminated"
                        }
                    ];
                    break;
                }
                case Events.LobbyEnd: {
                    const { winner } = message.data;
                    const players = !message.data.isTeamsMode ? message.data.users : Object.values(message.data.users);
                    const table = await this.generateResultsTable(players.slice(0, 10), null, {
                        end: true,
                        isTeamsMode: message.data.isTeamsMode
                    });


                    messageData.embed.description = Texts.LobbyEnd +
                        "```js\n" +
                        table.toString() +
                        "\n```"
                    break;
                }
                case Events.LobbyWarning: {
                    const {remaining, warnCount} = message.data;
                    let timeF;

                    if (remaining < 60) {
                        timeF = remaining + " seconds";
                    } else {
                        timeF = (remaining / 60).toFixed(1) + " minutes";
                    }

                    messageData.embed.description = Texts[warnCount >= 2 ? "LobbyTimeWarningLast" : "LobbyTimeWarning"]
                        .replace("{time}", timeF);
                    break;
                }
            }

            // Ugly check to see if embed has changed
            if (messageData.embed.description || messageData.embed.fields) {
                for (const c of message.recipients) {
                    await this.bot.client.rest.createMessage(c, messageData);
                }
            }
        };
    }

    /**
     * Generates a table for round results
     *
     * @param {any[]} players
     * @param {boolean} end
     * @returns {AsciiTable}
     */
    async generateResultsTable(players, wrTime, { end, isTeamsMode }) {
        const table = new AsciiTable()
            .removeBorder();

        const playersHeading = isTeamsMode && end ? "Team" : "Player";
        let fastestGhosts = players;

        if (end && !isTeamsMode) {
            fastestGhosts = fastestGhosts.sort((a, b) => b.points - a.points);
            table.setHeading("#", playersHeading, "Pts");
        } else if (end && isTeamsMode) {
            for (const team of fastestGhosts) {
                team.points = team.players.reduce((a, b) => a + b.points, 0)
            }
            fastestGhosts = fastestGhosts.sort((a, b) => b.points - a.points);
            table.setHeading("#", playersHeading, "Pts");
        } else {
            fastestGhosts = fastestGhosts.sort((a, b) => b.points - a.points);
            table.setHeading("#", playersHeading, "Time", "Pts");
        }

        for (let i = 0; i < fastestGhosts.length; ++i) {
            const player = fastestGhosts[i];
            let tag, finishTime, points = player.points | 0;

            if (!isTeamsMode) {
                if (player.aiDiff === User.AiDifficulty.DISABLED) {
                    tag = await this.bot.client.rest.fetchUser(player.userid).then(v => v.username);
                    finishTime = player.ghost.finishTimeSimple;
                } else {
                    const {aiDiff} = player;
                    tag = User.buildAIName(player.userid, aiDiff);
                    finishTime = timeSecondsToString(player.ghost.timeSeconds);
                }
            } else {
                tag = `Team ${player.id}`;
                points = player.points;
            }

            if (!end) {
                if (player.ghost.timeSeconds > 360) { // no ghost?
                    finishTime = "-";
                    points += " (+0)";
                } else {
                    points += ` (+${calculatePoints(player.ghost.timeSeconds - wrTime) | 0})`;
                }

                table.addRow(Medals[i] || i + 1, tag, finishTime, points);
            } else {
                table.addRow(Medals[i] || i + 1, tag, points);
            }
        }

        return table;
    }
}

/**
 * Formats `timeSeconds`
 *
 * @param {number} time
 * @returns {string}
 */
function timeSecondsToString(time) {
    const min = time / 60 | 0;
    const sec = time % 60;
    const ms = sec - (sec | 0);
    return String(min).padStart(2, "0") + ":" + String(sec | 0).padStart(2, 0) + (String(ms).slice(1, 5) || ".000");
}

/**
 * Calculates points for a player
 *
 * @param {number} timeOffWr
 * @returns {number}
 */
function calculatePoints(timeOffWr) {
    return Math.max(15 - (1.5 * timeOffWr), 3);
}

module.exports.LobbyStates = LobbyStates;
module.exports.Version = Version;
