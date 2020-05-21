const PersistentWebSocket = require("pws");
const WebSocket = require("ws");
const { ttcWS } = require("../../../configs/apis");
const { ttcToken } = require("../../../configs/bot");
const Logger = require("../Logger");
const AsciiTable = require("ascii-table");
const Version = "1.0-beta";

const Events = {
    ThresholdReached: 0x1,
    NewTrack: 0x2,
    GameStart: 0x4,
    RoundEnd: 0x8,
    LobbyEnd: 0x10
};

const LobbyStates = {
    Waiting: 0x1,
    ThresholdReached: 0x2,
    MapPick: 0x4,
    Preparation: 0x8,
    Ingame: 0x10,
    Upload: 0x20
};

const Medals = ["🥇", "🥈", "🥉"];

module.exports = class TTCGateway {
    constructor(bot) {
        this.bot = bot;
        this.connection = new PersistentWebSocket(ttcWS, WebSocket);
        this.ready = false;
    }

    init() {
        this.connection.onopen = () => {
            console.log("Sent IDENTIFY call");
            this.ready = true;
            this.connection.send(JSON.stringify({
                t: "IDENTIFY",
                d: {
                    key: ttcToken
                }
            }));
        };

        this.connection.onclose = () => {
            this.ready = false;
        };

        this.connection.onmessage = async ({ data: event }) => {
            // TODO: clean this mess up
            let message;
            try {
                message = JSON.parse(event);
            } catch(e) {
                return Logger.error(e.message);
            }

            switch(message.type) {
                case Events.NewTrack:
                    for (const c of message.recipients) {
                        this.bot.client.rest.createMessage(c, {
                            embed: {
                                title: `TT-Competition ${Version}`,
                                color: 0x2ecc71,
                                description: `Preparation phase has started. Boot up Mario Kart Wii and complete a ghost on ${message.data.message}`,
                                footer: {
                                    text: `Lobby ID: ${message.data.lobbyID}`
                                }
                            }
                        });
                    }
                break;
                case Events.ThresholdReached:
                    for (const c of message.recipients) {
                        this.bot.client.rest.createMessage(c, {
                            embed: {
                                title: `TT-Competition ${Version}`,
                                color: 0x2ecc71,
                                description: "Minimum number of players for this lobby has been reached, waiting 30 more seconds for more players to join...",
                                footer: {
                                    text: `Lobby ID: ${message.data.lobbyID}`
                                }
                            }
                        });
                    }
                break;
                case Events.GameStart:
                    for (const c of message.recipients) {
                        this.bot.client.rest.createMessage(c, {
                            embed: {
                                title: `TT-Competition ${Version}`,
                                color: 0x2ecc71,
                                description: "Ingame phase has started! Make sure to upload a ghost to the ghost database on the selected track within the next 15 minutes.",
                                footer: {
                                    text: `Lobby ID: ${message.data.lobbyID}`
                                }
                            }
                        });
                    }
                break;
                case Events.RoundEnd:
                    const table = new AsciiTable()
                        .removeBorder()
                        .setHeading("#", "Player", "Time");


                    const filteredGhosts = message.data.remainingPlayers
                        .concat(message.data.eliminated)
                        .sort((a, b) => a.ghost.timeSeconds - b.ghost.timeSeconds)
                        .filter(v => v.ghost.timeSeconds > 0 && v.ghost.timeSeconds < 360); // > 0 seconds and < 6 minutes

                    for (let i = 0; i < filteredGhosts.length; ++i) {
                        const tag = await this.bot.client.rest.fetchUser(filteredGhosts[i].userid).then(v => v.username);
                        table.addRow(Medals[i] || i + 1, tag, filteredGhosts[i].ghost.finishTimeSimple);
                    }

                    const embed = {
                        title: `TT-Competition ${Version}`,
                        color: 0x2ecc71,
                        fields: [
                            {
                                name: "Top ghosts for this round",
                                value: "```js\n" + (table.toString().trim() || "No ghosts found") + "\n```"
                            },
                            {
                                name: "Eliminated",
                                value: message.data.eliminated.map((v, i) => `<@${v.userid}> (${v.total_rating + v.base_rating}R)`).join("\n") || "No players have been eliminated"
                            }
                        ]
                    };

                    for (const c of message.recipients) {
                        this.bot.client.rest.createMessage(c, { embed });
                    }
                break;
                case Events.LobbyEnd:
                    for (const c of message.recipients) {
                        this.bot.client.rest.createMessage(c, {
                            embed: {
                                title: `TT-Competition ${Version}`,
                                color: 0x2ecc71,
                                description: `Lobby has ended! Winner: <@${message.data.winner.userid}> (${message.data.winner.total_rating + message.data.winner.base_rating}R)`,
                                color: 0x2ecc71,
                                footer: {
                                    text: `Lobby ID: ${message.data.lobbyID}`
                                }
                            }
                        });
                    }
                break;
            }
        };
    }
}

module.exports.LobbyStates = LobbyStates;