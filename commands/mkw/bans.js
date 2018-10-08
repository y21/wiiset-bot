const fetch = require("node-fetch");

module.exports = class BansCommand {
    static async run(message) {
        try {
            const limit = parseInt(message.args[1]) || 5;
            if (limit >= 10) return message.reply("⛔ Ban limit should not exceed 10 entries!");
            const request = await fetch("https://wiimmfi.glitch.me/bans?limit=" + limit);
            const json = await request.json();

            message.channel.send({
                embed: {
                    title: "Latest Wiimmfi bans",
                    fields: json.map(res => {
                        return {
                            name: res.name || "Unknown name",
                            value: `**__Reason__**: ${(res.reason || "Unknown").replace(/\n/g, ", ")}\n**__Ban ID__**: ${res.ban_id || "Unknown"}`
                        }
                    })
                }
            }).catch(console.log);
        } catch (e) {
            console.log(e);
        }
    }
};