module.exports = data => {
    const { client, guild } = data;
    client.channels.get("445300348903751691").send({
        embed: {
            title: "We lost a guild: " + guild.name,
            color: 0xFF0000,
            thumbnail: {
                url: guild.iconURL
            },
            fields: [
                {
                    name: "Members",
                    value: guild.memberCount
                },
                {
                    name: "Bot rate",
                    value: (guild.members.filter(m => m.user.bot).size / guild.memberCount * 100).toFixed(1) + "%"
                }
            ]
        }
    }).catch(console.error);
}