module.exports = {
    name: "mkwlist",
    ownerOnly: false,
    guildOnly: false,
    run: async (_, __, rest) => {
        const req = await rest.wiimmfi.getMKWList();
        return [{
            embed: {
                title: "Mario Kart Wii Room Overview",
                color: 0x00ff00,
                fields: [
                    {
                        name: "Worldwide rooms",
                        value: req.available.worldwides
                    },
                    {
                        name: "Continental rooms",
                        value: req.available.continentals
                    },
                    {
                        name: "Private rooms",
                        value: req.available.privates
                    },
                    {
                        name: "Total players",
                        value: req.available.players
                    }
                ]
            }
        }];
    }
};