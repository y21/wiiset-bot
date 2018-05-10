module.exports = message => {
    message.channel.send(new message.Discord.RichEmbed()
        .setTitle("Disclaimer")
        .setDescription("This bot is **not** affiliated with wiimmfi and it's an unofficial bot. The creator of this bot is y21#0909. It uses the wiimmfi api (which is also an unofficial one since wiimmfi doesn't have an official api?).\nThe online service was made by Wiimm and Leseratte!")
        .setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
    );
};
