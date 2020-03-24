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
                        value: req.worldwides || "0"
                    },
                    {
                        name: "Continental rooms",
                        value: req.continentals || "0"
                    },
                    {
                        name: "Private rooms",
                        value: req.privates || "0"
                    },
                    {
                        name: "Total players",
                        value: req.players || "0"
                    }
                ]
            }
        }];
    }
};