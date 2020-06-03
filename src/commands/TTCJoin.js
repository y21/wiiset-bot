module.exports = {
    name: "ttc join",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "Joins a TTC Lobby"
    },
    run: async (context, args, rest) => {
        await rest.ttc.addPlayerToLobby(args[0], context.userId, context.channelId, args[1]);

        return ["Successfully joined lobby!"];
    }
};