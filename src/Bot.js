const Detritus = require("detritus-client");
const Logger = require("./structures/Logger");
const { readdirSync } = require("fs");

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

    initCommands() {
        let commands;
        try {
            commands = readdirSync("./src/commands");
        } catch(e) {
            Logger.error("Could not read commands directory: " + e);
        }

        for (const command of commands) {
            const cmd = require(`./commands/${command}`);
            this.client.add({
                name: cmd.name,
                responseOptional: true,
                onBefore: context => cmd.ownerOnly ? context.client.isOwner(context.userId) : true,
                onCancel: context => context.reply("You are not allowed to execute this command"),
                run: async (...args) => {
                    const [context] = args;
                    let commandResponse;
                    try {
                        commandResponse = await cmd.run(...args);
                    } catch(e) {
                        commandResponse = "Error: " + e;
                    }

                    this.client.rest.createMessage(context.channelId, ...commandResponse);
                }
            });
        }
        
        Logger.info(`Initialized ${this.client.commands.length} commands`);
    }

    async run() {
        const shardClient = await this.client.run();
        Logger.info(`Logged in! (Shard: ${shardClient.shardId}/${shardClient.shardCount})`);
        
        setInterval(() => {
            const presence = this.config.presences[Math.floor(Math.random() * this.config.presences.length)];
            shardClient.gateway.setPresence(presence);
        }, 60000);
    }
}

module.exports = Bot;