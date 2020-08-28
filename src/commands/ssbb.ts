import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import { makeNormalizedFields } from '../utils/utils';

export default <Cmd>{
    name: 'ssbb',
    ownerOnly: false,
    metadata: {
        description: ''
    },
    onrun: async function(client, context, args) {
        const { data } = await client.restClient.wiimmfi.getSsbbStats();

        await context.editOrReply({
            embed: {
                title: 'Super Smash Bros. Brawl Statistics',
                color: data.logins === 0 ? 0xFF0000 : 0x00FF00,
                fields: makeNormalizedFields(data, {
                    prettyNumbers: true
                })
            }
        });
    }
}