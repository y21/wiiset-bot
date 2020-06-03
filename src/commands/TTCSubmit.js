module.exports = {
    name: "ttc submit",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "Submits a ghost in a lobby"
    },
    run: async (context, args, rest) => {
        const ghost = await rest.ttc.submitGhost(args[0], context.userId, context.channelId);
        
        return [`Successfully submitted ghost! Time: ${ghost.finishTimeSimple}`];
    }
};