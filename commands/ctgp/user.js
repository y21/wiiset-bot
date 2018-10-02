const fetch = require("node-fetch");
const controllerCodes = require("../../controllerCodes.json");
const countryCodes = require("../../countryCodes.json");
const { getByTag } = require("../../utils/UserResolver");

module.exports = async message => {
    try {
        if (message.args.length == 1) return message.reply("No player ID provided. To get someone's player ID, you visit their profile by using the search bar at <http://chadsoft.co.uk/time-trials/players.html>. The player ID should be displayed on their profile.");
        if (message.args.length < 2) return message.reply("No player ID provided."); // TODO: if profile id of author is saved in db, use that
        let pid;
        
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
        let embedColor;
        switch (Object.entries(result.stars).sort((a, b) => a[1] < b[1])[0][0]) {
            case "bronze":
                embedColor = 0xCD7F32;
                break;
            case "silver":
                embedColor = 0xC0C0C0;
                break;
            case "gold":
                embedColor = 0xD4AF37;
                break;
        }
        message.channel.send({
            embed: {
                title: "Time Trial information about " + result.miiName,
                color: embedColor,
                description: "USB GCN Adapter attached: " + (result.usbGcnAdapterAttached ? "yes" : "no") + "\n" +
                    "Controller: " + (controllerCodes[result.controller] || "unknown") + "\n" +
                    "Country: " + (countryCodes[result.country] || "unknown"),
                fields: [{
                        name: "Stars",
                        value: `${result.stars.bronze} Bronze\n${result.stars.silver} Silver\n${result.stars.gold} Gold`
                    },
                    {
                        name: "Last 5 out of " + (result.miiNames.length < 5 ? "<5" : result.miiNames.length - 5) + " Mii names",
                        value: result.miiNames.slice(0, 5).map(e => "`" + e + "`").join(", ")
                    },
                    {
                        name: "Submitted ghosts",
                        value: result.ghostCount
                    },
                    {
                        name: "Ghosts",
                        value: result.ghosts.slice(0, 5).map(e => e.trackName + ": " + e.finishTimeSimple).join("\n") + (result.ghosts.length > 4 ? "\n... and " + (result.ghosts.length - 5) + " more. (" + result.ghosts.length + " total ghosts)" : "")
                    }
                ]
            }
        });
    } catch (e) {
        message.reply("An error occured while executing the command.");
        console.log(e)
    }
}
