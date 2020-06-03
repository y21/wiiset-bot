module.exports = {
    name: "ctgp stats",
    aliases: ["ctgpstats"],
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Displays general statistics about the Ghost Database"
    },
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