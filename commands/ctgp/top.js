const fetch = require("node-fetch");

// Country codes
const countryCodes = require("../../countryCodes.json");

module.exports = class TopCommand {
    static async run(message) {
        try {
            let limit = 10;
			let engineClass = message.flags.includes("200cc");
            if (message.flags.includes("l")) {
                limit = parseInt(message.args[1]);
                if (limit === NaN || limit > 10 || limit < 1) limit = 10;
            } else {
                message.args.splice(1, 0, "10");
            }
            if (message.args.length < 3) return message.reply("No course name provided.");
            const track = message.tracks.find(val => val.name.toLowerCase() === message.args.slice(2).join(" ").replace(/ *$/, "").toLowerCase());
            if (track === undefined) return message.reply("Course was not found.");
            const timestamp = Date.now();
            let result = JSON.parse((await (await fetch(`http://tt.chadsoft.co.uk${track.href.replace(/00\.json$/, engineClass ? "04.json" : "00.json")}`)).text()).replace(/^\s+/, ""));
            let counter = 0;
            message.channel.send("Took " + ((Date.now() - timestamp) / 1000).toFixed(1) + " seconds to fetch...", { embed: {
                    color: (message.member || { displayColor: 0x00FF00 }).displayColor,
                    title: "Top 10 ghosts for " + track.name,
                    fields: result.ghosts.slice(0, limit).map(val => { return {
                        name: "#" + (++counter) + ": " + val.player,
                        value: "Time: `" + val.finishTimeSimple + "`\n"
                            + "Country: " + countryCodes[val.country] || "???"
                    }})
                }}).catch();
        } catch(e) {
            message.reply("An error occured while executing the command." + e);
        }
    }
};
