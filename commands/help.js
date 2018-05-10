const fs = require("fs");

module.exports = message => {
    message.author.send(new message.Discord.RichEmbed()
        .setTitle("Help")
        .setDescription(fs.readdirSync('./commands/').map(dir => {
            return !dir.endsWith('.js') ? fs.readdirSync(`./commands/${dir}`).map(fname => "**" + message.prefix + fname.substr(0, fname.search(".js")) + "**").join("\n") : ["**" + message.prefix + dir.substr(0, dir.search(".js")) + "**"]
        }))
        .setThumbnail("http://chadsoft.co.uk/wiimmfi/wiimmfi-dark.png")
        .setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
    ).catch(e=>message.reply("an error occured while sending you a direct message."));
};
