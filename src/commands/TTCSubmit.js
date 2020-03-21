module.exports = {
    name: "ttc submit",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        const ghost = await rest.ttc.submitGhost(context.args[1], context.userId, context.channelId);
        if (ghost.status !== 200) {
            throw new Error(await ghost.text());
        }


        // TODO: Display time of ghost
        return ["Successfully submitted ghost!"];
    }
};