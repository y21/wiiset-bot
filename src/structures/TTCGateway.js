const pws = require("pws");
const ws = require("ws");
const { ttcAPI } = require("../../configs/apis");
const Logger = require("./structures/Logger");

const Events = {
    NewTrack: 0x1,
    GameStart: 0x2
};

module.exports = class TTCGateway {
    constructor(bot) {
        this.bot = bot;
        this.connection = new pws(ttcAPI, ws);
        this.ready = false;
    }

    init() {
        this.connection.onready = () => {
            this.ready = true;
        };

        this.connection.onclose = () => {
            this.ready = false;
        };

        this.connection.onmessage = ({ data: event }) => {
            let data;
            try {
                data = JSON.parse(event);
            } catch(e) {
                return Logger.error(e.message);
            }

            switch(data.type) {
                case Events.NewTrack:
                    for (const c of data.recipients) {
                        this.bot.client.rest.createMessage(c, {
                            embed: {
                                description: `Preparation phase has started. Boot up Mario Kart Wii and complete a ghost on ${data.data.message}`
                            }
                        });
                    }
                break;
                case Events.NewTrack:
                    for (const c of data.recipients) {
                        this.bot.client.rest.createMessage(c, {
                            embed: {
                                description: "Ingame phase has started! You have 15 minutes to complete a ghost and upload it to the ghost database.\n"
                            }
                        });
                    }
                break;
            }
        };
    }
}