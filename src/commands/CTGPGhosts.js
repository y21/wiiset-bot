const { CTGPProfileID, Snowflake } = require("../structures/Constants").Regexes;

module.exports = {
    name: "ctgpghosts",
    ownerOnly: false,
    guildOnly: false,
    run: async (_, args, rest) => {
        if (args.length === 0)
            throw new Error("No arguments provided...");
        let pid;
        if (Snowflake.test(args[0])) {
            // todo: get pid from database
        } else if (!CTGPProfileID.test(args[0])) {
            throw new Error("Invalid Profile ID provided...");
        } else {
            pid = args[0];
        }
        
        const response = await rest.ctgp.getProfileInfo(pid);

        return [{
            embed: {
                color: 0xCD7F32,
                title: "First 10 ghosts of player " + response.miiName,
                fields: response.ghosts
                    .slice(0, 10)
                    .map(v => {
                        return {
                            name: v.trackName || "Unknown track",
                            value: `Finish time: ${v.finishTimeSimple}\n` +
                            `Fastest lap: ${v.bestSplitSimple}\n` +
                            `Engine class: ${v["200cc"] ? "200cc" : "150cc"}\n` +
                            `Star: ${v.stars ? (v.stars.gold ? "Gold" : (v.stars.silver ? "Silver" : (v.stars.bronze ? "Bronze" : ""))) : "-"}`
                        };
                    })
            }
        }];
    }
};