const { LobbyOptions, formatLobbyOptions, hasOption } = require("../rest/TTCRest");

module.exports = {
    name: "ttc createlobby",
    guildOnly: false,
    ownerOnly: true,
    metadata: {
        examples: [
            ["w.ttc createlobby 150cc, RT, NoElimination", "150cc, Regular Tracks and no Elimination after each round"],
            ["w.ttc createlobby 200cc", "200cc, All Tracks and Elimination"],
            ["w.ttc createlobby 200cc, CT", "200cc, Custom Tracks and Elimination"],
            ["w.ttc createlobby 200cc, CT, Private", "200cc, Custom Tracks, Elimination and Private (password required to join)"]
        ]
    },
    run: async function (context, args, rest) {
        if (args.length < 2) {
            // Yeah I know, this is ugly
            return context.reply("Invalid lobby options. Available options:\n" +
                Object.entries(Object.getOwnPropertyDescriptors(LobbyOptions))
                    .filter(([, desc]) => !desc.get)
                    .map(v => `- ${v[0]}`)
                    .join("\n") +
                "\nExamples: \n" +
                this.metadata.examples.map(([cmd, expl]) => `\`${cmd}\` => ${expl}`).join("\n"));
        }

        // Parse options
        const options = args.slice(1)
            .join(" ")
            .split(/, */g)
            .filter(v => LobbyOptions.hasOwnProperty(v)) // To prevent access to 'constructor'
            .map(v => LobbyOptions[v])
            .reduce((a, b) => a | b);

        const data = await rest.ttc.createLobby(context.userId, context.channelId, options);
        if (data.status !== 200) {
            throw new Error(await data.text());
        }

        const lobby = await data.json();

        // Attempt to send password to message author
        if (hasOption(lobby.options, LobbyOptions.Private)) {
            try {
                await context.message.author.createMessage(`🔒 Password for lobby: __${lobby.password}__. This is required for people to join this lobby because it has been marked as **private**.`)
            } catch {
                await rest.ttc.removePlayerFromLobby(lobby.id, context.userId, context.channelId);
                return context.reply(`<@${context.userId}> could not send the lobby password in direct messages. Please enable \`Allow direct messages from server members\`. https://i.imgur.com/7N0zBK0.gif`);
            }
        }

        return [{
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
        }]
    }
};