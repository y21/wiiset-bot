module.exports = {
    name: "ttc register",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        const user = await rest.ttc.registerUser(context.userId, args[1]);
        if (user.status !== 200) {
            throw new Error(await user.text());
        }

        const data = await user.json();

        return [`✅ Successfully registered (New rating: ${data.total_rating + data.base_rating}).`];
    }
};