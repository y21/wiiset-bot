import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'ttc user',
    ownerOnly: false,
    metadata: {
        description: '"Displays TTC user stats'
    },
    onrun: async function(client, context, args) {
        const user = await client.restClient.ttc.getUser(context.userId);

        await context.editOrReply({
            embed: {
                color: 0x2ecc71,
                fields: [
                    {
                        name: 'Rating',
                        value: (user.rating || 0).toLocaleString()
                    },
                    {
                        name: 'CTGP Profile ID',
                        value: user.pid || '?'
                    }
                ]
            }
        });
    }
}