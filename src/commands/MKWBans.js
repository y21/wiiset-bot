const fetch = require("node-fetch");
const { wiimmfiAPI } = require("../../configs/apis");


module.exports = {
    name: "mkwbans",
    ownerOnly: false,
    guildOnly: false,
    run: async () => {
        const req = await fetch(`${wiimmfiAPI}/bans`).then(v => v.json());
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