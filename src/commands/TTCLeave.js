module.exports = {
    name: "ttc leave",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        const lobby = await rest.ttc.removePlayerFromLobby(args[1], context.userId, context.channelId);
        if (lobby.status !== 200) {
            throw new Error(await lobby.text());
        }

        return ["Successfully left lobby!"];
    }
};