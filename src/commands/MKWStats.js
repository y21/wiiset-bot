module.exports = {
    name: "mkw stats",
    aliases: ["mkwstats"],
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Displays general MKW statistics"
    },
    run: async (_, __, rest) => {
        const req = await rest.wiimmfi.getMKWData();
        return [{
            embed: {
                title: "Mario Kart Wii Statistics",
                color: 0x00ff00,
                fields: [
                    {
                        name: "Total profiles",
                        value: req.totalProfiles || "0"
                    },
                    {
                        name: "Online",
                        value: req.online || "0"
                    },
                    {
                        name: "Logins",
                        value: req.logins || "0"
                    }
                ]
            }
        }];
    }
};