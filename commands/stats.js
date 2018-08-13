module.exports = message => {
    const { client } = message,
        ping = client.ping >= 350 ? 0xFF0000 : (client.ping >= 150 ? 0xFFA500 : (client.ping >= 100 ? 0xFFFF00 : 0x00FF00));
    message.channel.send({
        embed: {
            title: "Bot statistics",
            color: ping,
            fields: [
                {
                    name: (message.translations.commands.guilds || "Translation error"),
                    value: `${client.guilds.sort((a,b)=>b.memberCount - a.memberCount).filter(guild => guild.members.filter(e => e.user.bot).size < guild.members.filter(e => !e.user.bot).size).array().slice(0, 5).map(guild => "`" + guild.name + "`").join(", ")} ${client.guilds.size > 5 ? "... " + (client.guilds.size - 5) + " more" : ""}`
                },
                {
                    name: (message.translations.commands.users || "Translation error"),
                    value: client.users.size
                },
                {
                    name: (message.translations.commands.emojis || "Translation error"),
                    value: `${client.emojis.array().slice(0, 25).join(", ")} ${client.emojis.size > 25 ? "... " + (client.emojis.size - 25) + " more" : ""}`
                },
                {
                    name: (message.translations.commands.ping || "Translation error"),
                    value: client.ping.toFixed(2)
                },
                {
                    name: (message.translations.commands.uptime || "Translation error"),
                    value: (client.uptime / 1000 / 60 / 60).toFixed(2) + " hours"
                },
                {
                    name: (message.translations.commands.nodejs_ver || "Translation error"),
                    value: process.version
                }
            ]
        }
    });
};
