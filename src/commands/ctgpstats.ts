import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'ctgp stats',
    ownerOnly: false,
    metadata: {
        description: 'Displays Ghost Database statistics'
    },
    onrun: async function(client, context, args) {
        const result = await client.restClient.ctgp.getStats();

        await context.reply({
            embed: {
                title: 'CTGP Statistics',
                color: 0x00FF00,
                fields: [
                    {
                        name: 'Registered ghosts',
                        value: (result.uniquePlayers ?? 0).toLocaleString()
                    },
                    {
                        name: 'Existing leaderboards',
                        value: (result.leaderboardCount ?? 0).toLocaleString()
                    },
                    {
                        name: 'Total ghosts',
                        value: (result.ghostCount ?? 0).toLocaleString()
                    }
                ]
            }
        });
    }
}