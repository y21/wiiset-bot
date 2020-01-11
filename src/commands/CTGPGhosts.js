const { CTGPProfileID, Snowflake } = require("../structures/Constants").Regexes;

module.exports = {
    name: "ctgpghosts",
    ownerOnly: false,
    guildOnly: false,
    run: async (context, args, rest) => {
        if (args.length === 0)
            throw new Error("No arguments provided...");
        let pid;
        if (Snowflake.test(args[0])) {
            const query = await context.db.query("SELECT pid FROM pids WHERE author = $1", [context.userId]);
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
        const pages = [];
        for (let i = 0; i < response.ghosts.length; i += 5) {
            pages.push({
                embed: {
                    color: 0xCD7F32,
                    title: "Ghosts of player " + response.miiName,
                    fields: response.ghosts
                        .slice(i, i + 5)
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
            });
        }

        context.paginator.createReactionPaginator({
            pages,
            message: context.message
        });
    }
};