module.exports = {
    name: "info",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "Displays Bot information"
    },
    run: async (context) => {
        const ping = await context.client.ping();
        const { rss } = process.memoryUsage();

        return [{
            embed: {
                title: "Information",
                color: 0x2980b9,
                fields: [
                    {
                        name: "Ping",
                        value: `Gateway: ${ping.gateway}ms\nREST: ${ping.rest}ms`
                    },
                    {
                        name: "Shard",
                        value: "#" + context.client.shardId
                    },
                    {
                        name: "Owner(s)",
                        value: context.client.owners.join("\n")
                    },
                    {
                        name: "Memory usage",
                        value: (rss / 1024 ** 2).toFixed(2) + "mb"
                    }
                ]
            }
        }];
    }
};