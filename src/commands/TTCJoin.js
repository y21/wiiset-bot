module.exports = {
    name: "ttc join",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "Joins a TTC Lobby"
    },
    run: async (context, args, rest) => {
        if (args[0] && isNaN(args[0])) {
            throw new Error("Invalid Lobby ID");
        }
        await rest.ttc.addPlayerToLobby(args[0], context.userId, context.channelId, args[1]);

        return ["Successfully joined lobby!"];
    }
};