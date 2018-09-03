const fetch = require("node-fetch");

module.exports = async message => {
    try {
        const timestamp = Date.now();
        if (message.args.length < 2) return message.reply("No course name provided.");
        const track = message.tracks.find(val => val.name === message.args.slice(1).join(" "));
        if (track === undefined) return message.reply("Course was not found.");
        let result = JSON.parse((await (await fetch(`http://tt.chadsoft.co.uk${track.href}`)).text()).replace(/^\s+/, ""));
        let counter = 0;
        message.channel.send("Took " + ((Date.now() - timestamp) / 1000).toFixed(1) + " seconds to fetch...", { embed: {
            color: (message.member || { displayColor: 0x00FF00 }).displayColor,
            title: "Top 10 ghosts for " + track.name,
            fields: result.ghosts.slice(0, 10).map(val => { return {
                name: "#" + (++counter) + ": " + val.player,
                value: "Time: `" + val.finishTimeSimple + "`\n"
            }})
        }}).catch();
    } catch(e) {
        message.reply("An error occured while executing the command." + e);
    }
}
