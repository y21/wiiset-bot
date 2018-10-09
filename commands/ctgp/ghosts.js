const fetch = require("node-fetch");
const { getByTag } = require("../../utils/UserResolver");

module.exports = class GhostsCommand {
    static async run(message) {
        try {
            if (message.args.length == 1) return message.reply("No player ID provided. To get someone's player ID, you visit their profile by using the search bar at <http://chadsoft.co.uk/time-trials/players.html>. The player ID should be displayed on their profile.");
            if (message.args.length < 2) return message.reply("No player ID provided.");
            let pid, page = 1, counts = [ 0, 5 ];

            if (message.mentions.users.size === 0) {
                if (/^.+#\d{4}$/.test(message.args[1])) {
                    if (!getByTag(message.client.users, message.args[1])) return message.reply("User not found.");
                    let prepared = await message.connection.prepare("SELECT * FROM pids WHERE user=?");
                    pid = await prepared.get([getByTag(message.client.users, message.args[1]).id]);
                    if (!pid) return message.reply("User did not add a Profile ID yet.");
                    pid = pid.pid;
                } else if (!/^[A-Z0-9]+$/.test(message.args[1])) return message.reply("Invalid Profile ID provided.");
                if (pid === undefined) pid = message.args[1];
            } else {
                let prepared = await message.connection.prepare("SELECT * FROM pids WHERE user=?");
                pid = await prepared.get([message.mentions.users.first().id]);
                if (!pid) return message.reply("Mentioned user did not add a Profile ID yet.");
                pid = pid.pid;
            }
            let request = await fetch(`http://tt.chadsoft.co.uk/players/${pid.substr(0, 2)}/${pid.substr(2)}.json`);
            let result = await request.text();
            if (request.headers.raw()["content-type"][0] !== "application/json") return message.reply("An invalid profile ID was provided. "); // if result is not an object
            result = JSON.parse(result.replace(/^\s*/g, ""));

            if (message.flags.some(v => v.startsWith("track="))) {
                result.ghosts = result.ghosts.filter(v => v.trackName === message.flags.find(v => v.startsWith("track=")).split("=")[1])
            }

            const msg = await message.channel.send({
                embed: {
                    color: (message.member || { displayColor: 0x000000 }).displayColor,
                    title: "Ghosts of player " + result.miiName,
                    fields: result.ghosts.slice(counts[0], counts[1]).map(v => {
                        return {
                            name: v.trackName || "Unknown track name",
                            value: `Finish time: ${v.finishTimeSimple}
                            Best lap: ${v.bestSplitSimple}
                            Star: ${v.stars ? (v.stars.gold ? "Gold" : (v.stars.silver ? "Silver" : (v.stars.bronze ? "Bronze" : ""))) : "-"}`
                        }
                    }),
                    footer: {
                        text: `Page ${page}/${Math.floor(result.ghosts.length / 5)}`
                    }
                }
            });
            await msg.react("⬅");
            await msg.react("➡");

            const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id && (reaction.emoji.name === "➡" || reaction.emoji.name === "⬅"), {
                time: 180000
            });

            collector.on("collect", async reaction => {
                await reaction.remove(message.author).catch();
                if ((reaction.emoji.name === "⬅" && page === 1) || (reaction.emoji.name === "➡" && page === Math.floor(result.ghosts.length / 5))) return;
                if (reaction.emoji.name === "⬅") counts[0] -= 5, counts[1] -= 5, --page;
                if (reaction.emoji.name === "➡") counts[0] += 5, counts[1] += 5, ++page;
                msg.edit({
                    embed: {
                        color: (message.member || { displayColor: 0x000000 }).displayColor,
                        title: "Ghosts of player " + result.miiName,
                        fields: result.ghosts.slice(counts[0], counts[1]).map(v => {
                            return {
                                name: v.trackName || "Unknown track name",
                                value: `Finish time: ${v.finishTimeSimple}
                            Best lap: ${v.bestSplitSimple}
                            Star: ${v.stars ? (v.stars.gold ? "Gold" : (v.stars.silver ? "Silver" : (v.stars.bronze ? "Bronze" : ""))) : "-"}`
                            }
                        }),
                        footer: {
                            text: `Page ${page}/${Math.floor(result.ghosts.length / 5)}`
                        }
                    }
                }).catch(console.error); // TODO: don't log errors; pass undefined to catch

            });
            collector.on("end", () => {
                msg.reactions.filter(reaction => reaction.me).map(async reaction => await reaction.remove().catch());
                collector.stop();
            });
        } catch(e) {
            message.reply("An error occured while executing the command.");
            console.log(e);
        }
    }
};