import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import { Markup } from 'detritus-client/lib/utils';

export default <Cmd>{
    name: 'rex',
    ownerOnly: false,
    metadata: {
        description: 'Runs code in a given programming language'
    },
    onrun: async function(client, context, args) {
        const [lang, ...code] = args.rex.split(' ');
        const result = await client.restClient.rex.executeCode(lang, code.join(' '));
        
        await context.editOrReply(
            {
                content: Markup.codeblock(
                    result.Errors ?? result.Result ?? "Empty result", { language: lang }
                ),
                allowedMentions: {}
            }
        );
    }
}