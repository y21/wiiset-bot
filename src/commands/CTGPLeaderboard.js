const countryCodes = require("../../countryCodes");

module.exports = {
    name: "ctgpleaderboard",
    ownerOnly: false,
    guildOnly: false,
    run: async (context, args, rest) => {
        if (args.length === 0)
            throw new Error("Track name required");

        const track = context.trackHelper.tracks.find(v => v.name.toLowerCase() === args.join(" ").toLowerCase());
        if (!track)
            throw new Error("Track not found!");
        // TODO: use my improved API that uses cache
        const response = await rest.ctgp.getTrackByEndpoint(track.href, false);
        const uniqueGhosts = [];
        const pages = [];

        for (const ghost of response.ghosts) {
            if (uniqueGhosts.some(v => v.player === ghost.player)) continue;
            else uniqueGhosts.push(ghost);
        }

        for (let i = 0; i < uniqueGhosts.length; i += 5) {
            pages.push({
                embed: {
                    title: "Top ghosts for " + track.name,
                    fields: uniqueGhosts.slice(i, i + 5).map((v, j) => ({
                        name: `#${i + j + 1} ${v.player}`,
                        value: "Time: `" + v.finishTimeSimple + "`\n"
                        + "Country: " + (countryCodes[v.country || ""] || "???")
                    }))
                }
            });
        }

        context.paginator.createReactionPaginator({
            pages,
            message: context.message
        });
    }
};