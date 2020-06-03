module.exports = {
    name: "mkw bans",
    aliases: ["mkwbans"],
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Displays recent MKW Bans"
    },
    disabled: true,
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