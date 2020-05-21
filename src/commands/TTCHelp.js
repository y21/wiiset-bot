const { stateToString } = require("../structures/ttc/Lobby");

module.exports = {
    name: "ttc help",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        await context.paginator.createReactionPaginator({
            message,
            pages: [
                {
                }
            ]
        });
    }
};