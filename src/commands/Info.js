module.exports = {
    name: "info",
    guildOnly: false,
    ownerOnly: false,
    run: async (context) => {
        const ping = await context.client.ping();
        return [{
            embed: {
                title: "Information",
                color: 0x2980b9,
                fields: [
                    {
                        name: "Ping",
                        value: "Gateway: " + ping.gateway + "\nRest: " + ping.rest
                    },
                    {
                        name: "Shard",
                        value: "#" + context.client.shardId
                    },
                    {
                        name: "Owner(s)",
                        value: context.client.owners.join("\n")
                    }
                ]
            }
        }];
    }
};