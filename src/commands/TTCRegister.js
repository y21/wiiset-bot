module.exports = {
    name: "ttc register",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        const user = await rest.ttc.registerUser(context.userId, args[1]);

        return [`✅ Successfully registered! (New rating: ${user.rating}).`];
    }
};