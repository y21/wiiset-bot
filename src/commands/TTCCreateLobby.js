const { Options: LobbyOptions, formatOptions: formatLobbyOptions, hasOption, BotsLimit } = require("../structures/ttc/Lobby");
const { AiDifficulty } = require("../structures/ttc/User");

const numberEmojis = [
    "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"
];

const MaxRounds = 7;

const CpuReactions = Object.fromEntries(["EASY", "MEDIUM", "HARD", "EXPERT", "STOP"].map((k, i) => [ k, numberEmojis[i] ]));
const TeamReactions = Object.fromEntries(["2v2", "3v3", "4v4", "6v6"].map((k, i) => [ k, numberEmojis[i] ]));

module.exports = {
    name: "ttc create",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "Creates a TTC Lobby",
        examples: [
            ["w.ttc createlobby 150cc, RT, NoElimination", "150cc, Regular Tracks and no Elimination after each round"],
            ["w.ttc createlobby 200cc", "200cc, All Tracks and Elimination"],
            ["w.ttc createlobby 200cc, CT", "200cc, Custom Tracks and Elimination"],
            ["w.ttc createlobby 200cc, CT, Private", "200cc, Custom Tracks, Elimination and Private (password required to join)"]
        ]
    },
    run: async function (context, args, rest) {
        if (args.length < 1) {
            const availableOptions = Object.keys(LobbyOptions);

            return context.reply("Invalid lobby options.\nAvailable options:\n" + 
                availableOptions.map(v => `- ${v}`).join("\n") +
                "\nExamples:\n" +
                this.metadata.examples.map(([cmd, expl]) => `\`${cmd}\` => ${expl}`).join("\n"));
        }

        // Parse options
        let options = args
                .join(" ")
                .split(/, */g)
                .filter(v => Object.prototype.hasOwnProperty.call(LobbyOptions, v)); // To prevent access to 'constructor', 'prototype', ...
            
        if (options.length < 1) {
            return context.reply("Option(s) not found. Run command without arguments to get a list of available options.");
        }

        options = options.reduce((a, b) => a | LobbyOptions[b], 0);

        const response = await context.reply("Creating lobby...");
        await createLobby(context, rest, response, { options });
    }
};

function buildCPUMessage(index) {
    return {
        embed: {
            color: 0x2ecc71,
            description: `React with one of the emojis below to set the difficulty for CPU #${index + 1}\n` +
                Object.entries(CpuReactions).map(([k, v]) => v + " " + k).join("\n")
        }
    };
}

function handleBots(context, response) {
    return new Promise(async (resolve) => {
        await response.edit({
            ...buildCPUMessage(0),
            content: null
        });

        const botDiffs = [];
        const paginator = await context.paginator.createReactionPaginator({
            message: context.message,
            commandMessage: response,
            reactions: CpuReactions
        });

        paginator.on("raw", (data) => {
            const { emoji } = data;
    
            switch (emoji.name) {
                case CpuReactions.EASY:
                    botDiffs.push(AiDifficulty.EASY);
                    break;
                case CpuReactions.MEDIUM:
                    botDiffs.push(AiDifficulty.MEDIUM);
                    break;
                case CpuReactions.HARD:
                    botDiffs.push(AiDifficulty.HARD);
                    break;
                case CpuReactions.EXPERT:
                    botDiffs.push(AiDifficulty.EXPERT);
                    break;
                case CpuReactions.STOP:
                    paginator.stop();
                    return resolve(botDiffs);
            }
    
            if (botDiffs.length >= BotsLimit) {
                paginator.stop();
                return resolve(botDiffs);
            }
            paginator.commandMessage.edit({
                ...buildCPUMessage(botDiffs.length),
                content: null
            });
        });
    });
}

function handleRounds(context, response) {
    return new Promise(async (resolve) => {
        await response.edit({
            embed: {
                color: 0x2ecc71,
                description: "React with one of the emojis below to set the maximum number of rounds\n" + 
                    new Array(MaxRounds).fill().map((_, i) => `${numberEmojis[i]} ${(1 << i) * 2} rounds`).join("\n")
            },
            content: null
        });

        const paginator = await context.paginator.createReactionPaginator({
            message: context.message,
            commandMessage: response,
            reactions: Object.fromEntries(numberEmojis.slice(0, MaxRounds).map(v => [ v, v ]))
        });

        paginator.on("raw", (data) => {
            const { emoji } = data;

            const index = numberEmojis.indexOf(emoji.name);
            if (index < 0 || index + 1 > MaxRounds) return;
    
            paginator.stop();
            resolve(1 << (index + 1));
        });
    });
}

function handleTeams(context, response) {
    return new Promise(async (resolve) => {
        await response.edit({
            embed: {
                color: 0x2ecc71,
                description: `React with one of the emojis below to set the team size for this lobby\n` +
                    Object.entries(TeamReactions).map(([k, v]) => v + " " + k).join("\n")
            },
            content: null
        });

        const paginator = await context.paginator.createReactionPaginator({
            message: context.message,
            commandMessage: response,
            reactions: TeamReactions
        });
    
        paginator.on("raw", (data) => {
            const { emoji } = data;
            switch (emoji.name) {
                case TeamReactions["2v2"]:
                    resolve(LobbyOptions.Teams2);
                    break;
                case TeamReactions["3v3"]:
                    resolve(LobbyOptions.Teams3);
                    break;
                case TeamReactions["4v4"]:
                    resolve(LobbyOptions.Teams4);
                    break;
                case TeamReactions["6v6"]:
                    resolve(LobbyOptions.Teams6);
                    break;              
            }
            paginator.stop();
        });
    });
}

async function createLobby(context, rest, response, userData) {
    let botDiffs, maxRounds;
    if (hasOption(userData.options, LobbyOptions.Bots)) {
        botDiffs = await handleBots(context, response); 
    }

    if (hasOption(userData.options, LobbyOptions.Teams)) {
        userData.options |= await handleTeams(context, response);
    }

    if (!hasOption(userData.options, LobbyOptions.Elimination)) {
        maxRounds = await handleRounds(context, response);
    }

    let data;

    try {
        data = await rest.ttc.createLobby(context.userId, context.channelId, {
            options: userData.options,
            aiDiffs: botDiffs,
            maxRounds
        });
    } catch(e) {
        await response.edit({
            content: e.message,
            embed: null
        });
        return;
    }
    
    await sendOrEditLobbyMessage(context, rest, response, data);
}

async function sendOrEditLobbyMessage(context, rest, response, lobby) {
    // Attempt to send password to message author
    if (hasOption(lobby.options, LobbyOptions.Private)) {
        try {
            await context.message.author.createMessage(`🔒 Password for lobby: __${lobby.password}__. This is required for people to join this lobby because it has been marked as **private**.`)
        } catch {
            await rest.ttc.removePlayerFromLobby(lobby.id, context.userId, context.channelId);
            return context.reply(`<@${context.userId}> could not send the lobby password in direct messages. Please enable \`Allow direct messages from server members\`. https://i.imgur.com/7N0zBK0.gif`);
        }
    }

    const messageData = {
        embed: {
            color: 0x2ecc71,
            description: "Successfully created lobby!",
            fields: [{
                    name: "Lobby ID",
                    value: lobby.id
                },
                {
                    name: "Lobby Options",
                    value: formatLobbyOptions(lobby.options) || "-"
                }
            ]
        }
    };

    if (hasOption(lobby.options, LobbyOptions.Teams)) {
        messageData.embed.fields.push({
            name: "Teams",
            value: lobby.teamsToString() || "-"
        });
    }

    if (response) {
        await response.edit({
            ...messageData,
            content: null
        });
    } else {
        await context.reply(messageData);
    }
}