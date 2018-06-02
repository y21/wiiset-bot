module.exports = message => {
    const { client } = message,
        ping = client.ping >= 350 ? 0xFF0000 : (client.ping >= 150 ? 0xFFA500 : (client.ping >= 100 ? 0xFFFF00 : 0x00FF00));
    message.channel.send({
        embed: {
            title: "Bot statistics",
            color: ping,
            fields: [
                {
                    name: "Guilds",
                    value: `${client.guilds.sort((a,b)=>b.memberCount - a.memberCount).filter(guild => guild.members.filter(e => e.user.bot).size < guild.members.filter(e => !e.user.bot).size).array().slice(0, 5).map(guild => "`" + guild.name + "`").join(", ")} ${client.guilds.size > 5 ? "... " + (client.guilds.size - 5) + " more" : ""}`
                },
                {
                    name: "Users",
                    value: client.users.size
                },
                {
                    name: "Emojis",
                    value: client.emojis.size
                },
                {
                    name: "Ping",
                    value: client.ping.toFixed(2)
                },
                {
                    name: "Uptime",
                    value: (client.uptime / 1000 / 60 / 60).toFixed(2) + " hours"
                },
                {
                    name: "NodeJS version",
                    value: process.version
                }
            ]
        }
    });
};
