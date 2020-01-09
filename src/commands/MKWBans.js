module.exports = {
    name: "mkwbans",
    ownerOnly: false,
    guildOnly: false,
    run: async (_, __, rest) => {
        const req = await rest.wiimmfi.getMKWBans();
        return [{
            embed: {
                fields: req.map(v => ({
                    name: v.name || "?",
                    value: v.reason || "?"
                }))
            }
        }];
    }
};