import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'mkw regions',
    ownerOnly: false,
    metadata: {
        description: ''
    },
    onrun: async function(client, context, args) {
        const result = await client.restClient.wiimmfi.getMkwLoginRegions();

        await context.editOrReply({
            embed: {
                title: 'Login Regions',
                color: 0x00ff00,
                fields: [
                    {
                        name: 'CTGP',
                        value: String(result.ctgp || 0)
                    },
                    {
                        name: 'America',
                        value: String(result.ame || 0)
                    },
                    {
                        name: 'Japan',
                        value: String(result.jap || 0)
                    },
                    {
                        name: 'Europe',
                        value: String(result.eur || 0)
                    }
                ]
            }
        });
    }
}