module.exports = {
    name: "ttc user",
    guildOnly: false,
    ownerOnly: true,
    run: async (context, args, rest) => {
        const user = await rest.ttc.getUser(context.userId);
        if (user.status !== 200) {
            throw new Error(await user.text());
        }

        const data = await user.json();

        return [{
            embed: {
                color: 0x2ecc71,
                fields: [
                    {
                        name: "Base rating",
                        value: (data.base_rating || 0).toLocaleString()
                    },
                    {
                        name: "Total rating",
                        value: (data.total_rating || 0).toLocaleString()
                    },
                    {
                        name: "CTGP Profile ID",
                        value: data.pid || "?"
                    }
                ]
            }
        }];
    }
};