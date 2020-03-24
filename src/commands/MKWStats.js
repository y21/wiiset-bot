module.exports = {
    name: "mkwstats",
    aliases: ["mkw stats"],
    ownerOnly: false,
    guildOnly: false,
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