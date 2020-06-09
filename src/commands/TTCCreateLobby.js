const { Options: LobbyOptions, formatOptions: formatLobbyOptions, hasOption, BotsLimit } = require("../structures/ttc/Lobby");
const { AiDifficulty } = require("../structures/ttc/User");

const CpuReactions = {
    EASY: "🟢",
    MEDIUM: "🟠",
    HARD: "🔴",
    EXPERT: "⚪",
    STOP: "⏹"
};

const TeamReactions = {
    "2v2": "2️⃣",
    "3v3": "3️⃣",
    "4v4": "4️⃣",
    "6v6": "6️⃣"
};

module.exports = {
    name: "ttc create",
    guildOnly: false,
    ownerOnly: true,
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
                .filter(v => LobbyOptions.hasOwnProperty(v)) // To prevent access to 'constructor', 'prototype', ...
                .map(v => LobbyOptions[v]);
            
        if (options.length < 1) {
            return context.reply("Option(s) not found. Run command without arguments to get a list of available options.");
        }
        
        options = options.reduce((a, b) => a | b);

        if (hasOption(options, LobbyOptions.Teams)) {
            return handleTeamsOption(context, rest, options);
        }

        if (hasOption(options, LobbyOptions.Bots)) {
            return handleBotsOption(context, rest, options, null);
        }

        await createLobby(context, rest, options, []);
    }
};

function handleTeamsOption(context, rest, options) {
    const response = await context.reply({
        embed: {
            color: 0x2ecc71,
            description: `React with one of the emojis below to set the team size for this lobby\n` +
                Object.entries(TeamReactions).map(([k, v]) => v + " " + k).join("\n")
        }
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
                options |= LobbyOptions.Teams2;
                break;
            case TeamReactions["3v3"]:
                options |= LobbyOptions.Teams3;
                break;
            case TeamReactions["4v4"]:
                options |= LobbyOptions.Teams4;
                break;
            case TeamReactions["6v6"]:
                options |= LobbyOptions.Teams6;
                break;              
        }

        return handleBotsOption(context, rest, options, response);
    });
}

function handleBotsOption(context, rest, options, resp) {
    const botDiffs = [];

    const response = resp || await context.reply(buildCPUMessage(0));

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
                createLobby(context, rest, options, botDiffs, response);
                return;
        }

        if (botDiffs.length >= BotsLimit) {
            paginator.stop();
            createLobby(context, rest, options, botDiffs, response);
            return;
        }
        paginator.commandMessage.edit(buildCPUMessage(botDiffs.length));
    });
}

function buildCPUMessage(index) {
    return {
        embed: {
            color: 0x2ecc71,
            description: `React with one of the emojis below to set the difficulty for CPU #${index + 1}\n` +
                Object.entries(CpuReactions).map(([k, v]) => v + " " + k).join("\n")
        }
    };
}

async function createLobby(context, rest, options, aiDiffs, response) {
    const data = await rest.ttc.createLobby(context.userId, context.channelId, options, aiDiffs);
    
    await sendOrEditLobbyMessage(context, rest, data, response);
}

async function sendOrEditLobbyMessage(context, rest, lobby, response) {
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

    if (response) {
        await response.edit(messageData);
    } else {
        await context.reply(messageData);
    }
}