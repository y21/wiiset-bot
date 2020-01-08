const countryCodes = require("../../countryCodes");

module.exports = {
    name: "ctgpleaderboard",
    ownerOnly: false,
    guildOnly: false,
    run: async (context, args, rest) => {
        if (args.length === 0)
            throw new Error("Track name required");

        const track = context.trackHelper.tracks.find(v => v.name.toLowerCase() === args.join(" ").toLowerCase());
        // TODO: use my improved API that uses cache
        const response = await rest.ctgp.getTrackByEndpoint(track.href, false);
        const uniqueGhosts = [];

        for (const ghost of response.ghosts) {
            if (uniqueGhosts.some(v => v.player === ghost.player)) continue;
            else uniqueGhosts.push(ghost);
        }

        return [{
            embed: {
                title: "Top 10 ghosts for " + track.name,
                fields: uniqueGhosts.slice(0, 10).map((v, i) => ({
                    name: `#${i + 1} ${v.player}`,
                    value: "Time: `" + v.finishTimeSimple + "`\n"
                    + "Country: " + (countryCodes[v.country || ""] || "???")
                }))
            }
        }];
    }
};