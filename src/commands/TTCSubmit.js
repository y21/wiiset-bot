module.exports = {
    name: "ttc submit",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        const ghost = await rest.ttc.submitGhost(args[1], context.userId, context.channelId);
        
        return [`Successfully submitted ghost! Time: ${ghost.finishTimeSimple}`];
    }
};