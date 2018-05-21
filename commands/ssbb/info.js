const { get } = require("snekfetch");
const { RichEmbed } = require("discord.js");

module.exports = message => {
    get("https://wiimmfi.glitch.me/ssbb/amount").then(result => {
        message.channel.send(new RichEmbed()
            .setTitle("Super Smash Bros. Brawl information")
            .addField("Total profiles", result.body.totalProfiles)
            .addField("Currently online", result.body.online)
            .setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
            .setThumbnail('http://chadsoft.co.uk/wiimmfi/wiimmfi-dark.png')
            .setFooter("Data will be refreshed every 30 seconds")
            .setTimestamp(result.body.lastEdit)
        );
    });
};
