module.exports = {
    name: "ctgpstats",
    ownerOnly: false,
    guildOnly: false,
    run: async (_, __, rest) => {
        const req = await rest.ctgp.getStats();
        return [{
            embed: {
                title: "CTGP Statistics",
                color: 0x00FF00,
                fields: [
                    {
                        name: "Registered ghosts",
                        value: (req.uniquePlayers || 0).toLocaleString()
                    },
                    {
                        name: "Existing leaderboards",
                        value: (req.leaderboardCount || 0).toLocaleString()
                    },
                    {
                        name: "Total ghosts",
                        value: (req.ghostCount || 0).toLocaleString()
                    }
                ]
            }
        }];
    }
};