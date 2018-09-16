module.exports = data => {
    const { client, guild } = data;
    client.channels.get("445297325095780372").send({
        embed: {
            title: "A new guild: " + guild.name,
            color: 0xFFFF00,
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
            ],
            footer: {
                text: "Amount of guilds: " + client.guilds.size
            }
        }
    }).then(msg => {
        msg.react("445296718070808586").catch(console.error);
    }).catch(console.error);
};