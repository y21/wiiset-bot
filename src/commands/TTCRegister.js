module.exports = {
    name: "ttc register",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "Register for TTC using your CTGP Profile ID"
    },
    run: async (context, args, rest) => {
        const user = await rest.ttc.registerUser(context.userId, args[0]);

        return [`✅ Successfully registered! (New rating: ${user.rating}).`];
    }
};