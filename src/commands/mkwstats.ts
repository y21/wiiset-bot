import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import { makeNormalizedFields } from '../utils/utils';

export default <Cmd>{
    name: 'mkw stats',
    ownerOnly: false,
    metadata: {
        description: ''
    },
    onrun: async function(client, context, args) {
        const result = await client.restClient.wiimmfi.getMkwData();

        await context.editOrReply({
            embed: {
                title: 'MKW Statistics',
                color: 0x00ff00,
                fields: makeNormalizedFields(result.data, { prettyNumbers: true })
            }
        });
    }
}