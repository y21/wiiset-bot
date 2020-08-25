import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import { getAttachmentUrl } from '../utils/utils';

export default <Cmd>{
    name: 'caption',
    ownerOnly: false,
    metadata: {
        description: 'Describes an image'
    },
    onrun: async function(client, context, args) {
        const result = await client.restClient.caption(
            getAttachmentUrl(context) ?? args.caption
        );
        await context.reply(result);
    }
}