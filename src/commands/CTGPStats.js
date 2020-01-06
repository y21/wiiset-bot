const fetch = require("node-fetch");
const { ctgpAPI } = require("../../configs/apis");


module.exports = {
    name: "ctgpstats",
    ownerOnly: false,
    guildOnly: false,
    run: async () => {
        const req = await fetch(`${ctgpAPI}/index.json`).then(v => v.text()).then(v => JSON.parse(v.replace(new RegExp("^[^{]"), "")));
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