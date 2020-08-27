import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import { inspect } from 'util';
import { Markup } from 'detritus-client/lib/utils';

export default <Cmd>{
    name: 'eval',
    ownerOnly: true,
    metadata: {
        description: 'Evaluates a JavaScript string'
    },
    onrun: async function(client, context, args) {
        let result;

        try {
            result = await eval(args.eval);
        } catch(e) {
            result = e.message;
        }

        await context.editOrReply(
            Markup.codeblock(
                typeof result === 'string' ? result : inspect(result, { depth: 1 }),
                {
                    language: 'js',
                    limit: 1980
                }
            )
        );
    }
}