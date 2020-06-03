module.exports = {
    name: "ttc user",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "Displays TTC user stats"
    },
    run: async (context, args, rest) => {
        const user = await rest.ttc.getUser(context.userId);

        return [{
            embed: {
                color: 0x2ecc71,
                fields: [
                    {
                        name: "Rating",
                        value: (user.rating || 0).toLocaleString()
                    },
                    {
                        name: "CTGP Profile ID",
                        value: user.pid || "?"
                    }
                ]
            }
        }];
    }
};