module.exports = {
    name: "mkwregions",
    ownerOnly: false,
    guildOnly: false,
    run: async (_, __, rest) => {
        const req = await rest.wiimmfi.getMKWLoginRegions();
        return [{
            embed: {
                title: "Mario Kart Wii Login Regions",
                color: 0x00ff00,
                fields: [
                    {
                        name: "CTGP",
                        value: req.ctgp || "0"
                    },
                    {
                        name: "America",
                        value: req.ame || "0"
                    },
                    {
                        name: "Japan",
                        value: req.jap || "0"
                    },
                    {
                        name: "Europe",
                        value: req.eur || "0"
                    },
                    {
                        name: "Total players",
                        value: Object.values(req).reduce((a, b) => a + b) || "0"
                    }
                ]
            }
        }];
    }
};