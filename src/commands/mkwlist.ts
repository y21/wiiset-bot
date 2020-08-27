import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import { makeNormalizedFields } from '../utils/utils';

export default <Cmd>{
    name: 'mkw list',
    ownerOnly: false,
    metadata: {
        description: 'Displays number of rooms'
    },
    onrun: async function(client, context, args) {
        const result = await client.restClient.wiimmfi.getMkwList();

        await context.editOrReply({
            embed: {
                title: 'Room Overview',
                color: 0x00ff00,
                fields: makeNormalizedFields(result, {
                    prettyNumbers: true
                })
            }
        });
    }
}