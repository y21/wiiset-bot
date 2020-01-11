const { CTGPProfileID, Snowflake } = require("../structures/Constants").Regexes;
const controllerCodes = require("../../controllerCodes");
const countryCodes = require("../../countryCodes");


module.exports = {
    name: "ctgpprofile",
    ownerOnly: false,
    guildOnly: false,
    run: async (_, args, rest) => {
        if (args.length === 0)
            throw new Error("No arguments provided...");
        let pid;
        if (Snowflake.test(args[0])) {
            const query = await context.db.query("SELECT pid FROM pids WHERE author = $1", [args[0]]);
            if (query.rowCount > 0)
                pid = query.rows[0].pid;
        } else if (!CTGPProfileID.test(args[0])) {
            throw new Error("Invalid Profile ID provided...");
        } else {
            pid = args[0];
        }

        if (!pid)
            throw new Error("Invalid Profile ID provided");
        
        const response = await rest.ctgp.getProfileInfo(pid);

        const bronzeStars = response.stars.bronze - response.stars.silver;
        const silverStars = response.stars.silver - response.stars.gold;
        const goldStars = response.stars.gold;

        let embedColor;
        if (response.stars.gold >= silverStars) embedColor = 0xD4AF37;
        else if (silverStars >= bronzeStars) embedColor = 0xC0C0C0;
        else embedColor = 0xCD7F32;

        return [{
            embed: {
                title: "Time Trial information about " + response.miiName,
                color: embedColor,
                description: "USB GCN Adapter attached: " + (response.usbGcnAdapterAttached ? "yes" : "no") + "\n" +
                    "Controller: " + (controllerCodes[response.controller] || "unknown") + "\n" +
                    "Country: " + (countryCodes[response.country] || "unknown"),
                fields: [{
                    name: "Stars",
                    value: `${bronzeStars} Bronze\n${silverStars} Silver\n${goldStars} Gold`
                },
                {
                    name: "Last 5 out of " + (response.miiNames.length < 5 ? "<5" : response.miiNames.length - 5) + " Mii names",
                    value: response.miiNames.slice(0, 5).map(e => "`" + e + "`").join(", ")
                },
                {
                    name: "Submitted ghosts",
                    value: response.ghostCount || 0
                },
                {
                    name: "Ghosts",
                    value: response.ghosts.slice(0, 5).map(e => e.trackName + ": " + e.finishTimeSimple).join("\n") + (response.ghosts.length > 4 ? "\n... and " + (response.ghosts.length - 5) + " more. (" + response.ghosts.length + " total ghosts)" : "")
                }
                ]
            }
        }];
    }
};