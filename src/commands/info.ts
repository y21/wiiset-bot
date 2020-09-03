import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'info',
    ownerOnly: false,
    metadata: {
        description: 'Displays bot stats'
    },
    onrun: async function(client, context, args) {
        const ping = await client.ping();

        if (!ping) return context.editOrReply('pinging failed...');

        const { rss } = process.memoryUsage();

        await context.editOrReply({
            embed: {
                title: 'Bot info',
                fields: [
                    {
                        name: 'Uptime',
                        value: ~~(process.uptime() / 60 / 60 / 24) + ' days'
                    },
                    {
                        name: 'Memory Usage',
                        value: ~~(rss / 1024 ** 2) + 'mb'
                    },
                    {
                        name: 'Ping',
                        value: `Gateway: ${ping.gateway}ms\nREST: ${ping.rest}`
                    }
                ]
            }
        });
    }
}