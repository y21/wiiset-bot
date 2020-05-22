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

const Medals = [ "🥇", "🥈", "🥉" ];

const Texts = {
    PreparationPhase: "ℹ️ Preparation phase has started. Boot up Mario Kart Wii and complete a ghost on {track}",
    ThresholdPhase: "⏱️ Minimum number of players for this lobby has been reached, waiting 30 more seconds for more players to join...",
    IngamePhase: "🏎️ Ingame phase has started! Make sure to upload a ghost to the ghost database on the selected track within the next 15 minutes.",
    LobbyEnd: "✅ Lobby has ended! Winner: <@{winner}> ({rating}R)"
};

module.exports = class TTCGateway {
    constructor(bot) {
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
        this.connection.onopen = this.identify;

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
                    messageData.embed.description = Texts.PreparationPhase.replace("{track}", message.data.message);

                    for (const c of message.recipients) {
                        this.bot.client.rest.createMessage(c, messageData);
                    }
                break;
                case Events.ThresholdReached:
                    messageData.embed.description = Texts.ThresholdPhase;

                    for (const c of message.recipients) {
                        this.bot.client.rest.createMessage(c, messageData);
                    }
                break;
                case Events.GameStart:
                    messageData.embed.description = Texts.IngamePhase;

                    for (const c of message.recipients) {
                        this.bot.client.rest.createMessage(c, messageData);
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

                    messageData.embed.fields = [
                        {
                            name: "Top ghosts for this round",
                            value: "```js\n" + (table.toString().trim() || "No ghosts found") + "\n```"
                        },
                        {
                            name: "Eliminated",
                            value: message.data.eliminated
                                .map((v) => `<@${v.userid}> (${v.total_rating + v.base_rating}R)`)
                                .join("\n") || "No players have been eliminated"
                        }
                    ];

                    for (const c of message.recipients) {
                        this.bot.client.rest.createMessage(c, messageData);
                    }
                break;
                case Events.LobbyEnd:
                    messageData.embed.description = Texts.LobbyEnd
                        .replace("{winner}", message.data.winner.userid)
                        .replace("{rating}", message.data.winner.total_rating + message.data.winner.base_rating);

                    for (const c of message.recipients) {
                        this.bot.client.rest.createMessage(c, messageData);
                    }
                break;
            }
        };
    }
}

module.exports.LobbyStates = LobbyStates;