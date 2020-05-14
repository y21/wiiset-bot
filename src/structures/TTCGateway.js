const PersistentWebSocket = require("pws");
const WebSocket = require("ws");
const { ttcWS } = require("../../configs/apis");
const { ttcToken } = require("../../configs/bot");
const Logger = require("./Logger");
const AsciiTable = require("ascii-table");
const Version = "1.0-beta";

const Events = {
    NewTrack: 0x1,
    GameStart: 0x2,
    RoundEnd: 0x4,
    LobbyEnd: 0x8
};

const LobbyStates = {
    Waiting: 0x1,
    MapPick: 0x2,
    Preparation: 0x4,
    Ingame: 0x8,
    Upload: 0x10
};

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
            console.log("closed");
            this.ready = false;
        };

        this.connection.onmessage = ({ data: event }) => {
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
                        const tag = await this.bot.rest.fetchUser(filteredGhosts[i].userid).then(v => v.tag);
                        table.addRow(i + 1, tag, filteredGhosts[i].ghost.finishTimeSimple);
                    }

                    const embed = {
                        title: `TT-Competition ${Version}`,
                        color: 0x2ecc71,
                        fields: [
                            {
                                name: "Top ghosts",
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

function calculateGainForPlacement(placement, totalPlayers) {
    // gain := int((totalPlayers * 35) / placement)
    return (totalPlayers * 35) / placement;
}