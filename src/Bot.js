const Detritus = require("detritus-client");
const Logger = require("./structures/Logger");

class Bot {
    constructor(config) {
        this.config = config;
        this.client = new Detritus.CommandClient(config.token, {
            prefix: config.prefix,
            isBot: true,
            mentionsEnabled: false,
            activateOnEdits: true,
            cache: false,
            gateway: {
                autoReconnect: true,
                identifyProperties: {
                    $browser: "Discord iOS"
                }
            }
        });
    }

    async initCommands() {

    }

    async run() {
        const shardClient = await this.client.run();
        Logger.info(`Logged in! (Shard: ${shardClient.shardId})`);
        
        setInterval(() => {
            shardClient.gateway.setPresence(this.config.presences[Math.floor(Math.random() * this.config.presences.length)]);
        }, 60000);
    }
}

module.exports = Bot;