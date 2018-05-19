const { RichEmbed } = require("discord.js");
module.exports = message => {
    if(message.mentions.users.size == 0) return message.reply("who to lick?!");
    message.channel.send(
        new RichEmbed()
            .setAuthor(message.mentions.users.first().tag, message.mentions.users.first().avatarURL, message.mentions.users.first().avatarURL)
            .setColor(0x77b254)
            .addField("Lick User", ":white_check_mark: Paws successfully licked.")
            .setFooter(`Licked by ${message.author.tag}`, message.author.avatarURL)
    );
};
