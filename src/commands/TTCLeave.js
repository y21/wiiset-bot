module.exports = {
    name: "ttc leave",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "Leaves a TTC Lobby"
    },
    run: async (context, args, rest) => {
        await rest.ttc.removePlayerFromLobby(args[0], context.userId, context.channelId);

        return ["Successfully left lobby!"];
    }
};