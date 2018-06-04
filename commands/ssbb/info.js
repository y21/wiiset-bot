const { get } = require("snekfetch");
const { RichEmbed } = require("discord.js");

module.exports = message => {
    get("https://wiimmfi.glitch.me/ssbb/amount").then(result => {
        message.channel.send(new RichEmbed()
            .setTitle("Super Smash Bros. Brawl information")
            .addField("Total profiles", result.body.totalProfiles)
            .addField("Currently online", result.body.online)
            .addField("Logins in the last 30 minutes", result.body.logins.thirty_minutes)
            .addField("Logins in the last four hours", result.body.logins.four_hours)
            .addField("Logins in the last 24 hours", result.body.logins.twentyfour_hours)
            .setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
            .setTimestamp(result.body.lastEdit)
        );
    });
};
