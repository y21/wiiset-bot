module.exports = message => {
    message.channel.send(new message.Discord.RichEmbed()
        .setTitle("Disclaimer")
        .setDescription("This bot is **not** affiliated with wiimmfi and it's an unofficial bot. The creator of this bot is y21#0909. It uses the wiimmfi api (which is also an unofficial one since wiimmfi doesn't have an official api?).\nThe online service was made by Wiimm and Leseratte!\nAlso this bot is in early development and may have some bugs which you should immediately report by either opening an issue on the repository or by telling me on wiiset's official discord server.")
        .setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
    );
};
