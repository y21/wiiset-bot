module.exports = message => {
    message.channel.send(new message.Discord.RichEmbed()
        .setTitle("Disclaimer")
        .setDescription(message.translations.commands.disclaimer || "Language error")
        .setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
    );
};
