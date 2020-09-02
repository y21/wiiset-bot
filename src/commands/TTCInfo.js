module.exports = {
    name: "ttc info",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "TTC information lol"
    },
    run: async (context, args, rest) => {
        await rest.ttc.addPlayerToLobby(args[0], context.userId, context.channelId, args[1]);

        return ["Successfully joined lobby!"];
    }
};