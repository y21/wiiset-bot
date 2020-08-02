const Detritus = require("detritus-client");
const pg = require("pg");
const Logger = require("./structures/Logger");
const { readdirSync } = require("fs");
const Database = require("./structures/Database");
const Rest = require("./rest/RestClient");
const TrackHelper = require("./structures/TrackHelper");
const { Paginator } = require("detritus-pagination");
const TTCGateway = require("./structures/ttc/Gateway");

const LinkOrIpRegex = /(https?:\/\/[^/ ,:]+)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?)/g;

/**
 * @param {string} str
 * @returns {string}
 */
function stripSensitiveLink(str) {
    return str.replace(LinkOrIpRegex, "::");
}

class Bot {
    constructor(config, database) {
        this.config = config;
        this.pool = new pg.Pool(database);
        this.db = new Database(this.pool);
        this.client = new Detritus.CommandClient(config.token, {
            prefix: config.prefix,
            shards: [0, 1],
            isBot: true,
            mentionsEnabled: false,
            activateOnEdits: true,
            cache: false,
            gateway: {
                intents: (1 << 9) || (1 << 12),
                autoReconnect: true,
                identifyProperties: {
                    $browser: "Discord iOS"
                }
            }
        });
        this.rest = new Rest();
        this.trackHelper = new TrackHelper(this.rest.ctgp);
        this.paginator = new Paginator(this.client.client, {
            maxTime: 300000,
            pageLoop: true,
            pageNumber: true
        });
        this.ttcGateway = new TTCGateway(this);
        this.ttcGateway.init();
    }

    initCommands() {
        let commands;
        try {
            commands = readdirSync("./src/commands");
        } catch(e) {
            Logger.error("Could not read commands directory: " + e);
        }

        // Middleware functions
        const onBefore = (cmd, context) => !cmd.disabled && (cmd.ownerOnly ? context.client.isOwner(context.userId) : true) && (cmd.guildOnly ? !context.inDm : true);
        const onRatelimit = context => context.editOrReply("calm down, don't spam!");
        const onCancel = context => context.editOrReply("Command execution failed");
        const run = async (cmd, context, args) => {
            context.db = this.db;
            context.trackHelper = this.trackHelper;
            context.paginator = this.paginator;

            let commandResponse;
            try {
                const realArgs = args[cmd.name];
                commandResponse = await cmd.run(context, realArgs ? realArgs.split(" ") : [], this.rest);
            } catch(e) {
                console.log(e.stack);

                let message = stripSensitiveLink(e.message);
                if (cmd.name.startsWith("ttc")) {
                    message = message[0].toUpperCase() + message.slice(1);
                    message += "\n\nConfused? Type `w.ttc help`!";
                }

                commandResponse = [ "⚠️ " + message ];
            }

            if (commandResponse.length > 0) {
                const messageData = {
                    allowedMentions: { parse: [] }
                };
                
                if (typeof commandResponse[0] === "string") {
                    messageData.content = commandResponse.join(" ");
                } else {
                    const o = commandResponse[0];
                    for (const k in o) messageData[k] = o[k];
                }

                context.editOrReply(messageData);
            }
        };

        for (const command of commands) {
            const cmd = require(`./commands/${command}`);
            this.client.add({
                name: cmd.name,
                aliases: cmd.aliases,
                responseOptional: true,
                activateOnEdits: true,
                ratelimit: {
                    limit: 1,
                    duration: 1000,
                    type: "user"
                },
                metadata: cmd.metadata,
                onRatelimit,
                onBefore: onBefore.bind(null, cmd),
                onCancel,
                run: run.bind(null, cmd)
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
