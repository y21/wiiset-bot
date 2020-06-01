module.exports = {
    name: "ttc leave",
    guildOnly: false,
    ownerOnly: true,
    run: async (context, args, rest) => {
        await rest.ttc.removePlayerFromLobby(args[1], context.userId, context.channelId);

        return ["Successfully left lobby!"];
    }
};