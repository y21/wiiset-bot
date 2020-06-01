module.exports = {
    name: "ttc join",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        await rest.ttc.addPlayerToLobby(args[1], context.userId, context.channelId, args[2]);

        return ["Successfully joined lobby!"];
    }
};