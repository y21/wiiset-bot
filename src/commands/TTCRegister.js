module.exports = {
    name: "ttc register",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        const user = await rest.ttc.registerUser(context.userId);
        if (user.status !== 200) {
            throw new Error(await user.text());
        }

        const data = await user.json();

        return [`✅ Successfully registered (rating: ${data.total_rating}).`];
    }
};