module.exports = {
    name: "ctgp recent",
    aliases: ["ctgprecent"],
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Displays recently set World Records"
    },
    run: async (context, args, rest) => {
        const response = await rest.ctgp.getRecentRecords();
        return [{
            embed: {
                title: "Recent World Records set",
                color: 0x00FF00,
                fields: response.slice(0, 6).map(v => ({
                    name: v.player || "???",
                    value: "Track: " + v.trackName +
                        "\nTrack version: " + (v.trackVersion || "Default") +
                        "\nTime: `" + v.finishTimeSimple + "`" +
                        "\nEngine class: `" + (v["200cc"] ? "200cc" : "150cc") + "`"
                }))
            }
        }];
    }
};