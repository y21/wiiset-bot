import Cmd from '../structures/basecommand';
import { execSync } from 'child_process';
import { Markup } from 'detritus-client/lib/utils';

export default <Cmd>{
    name: 'bash',
    ownerOnly: true,
    metadata: {
        description: 'Executes a shell command'
    },
    onrun: async function(client, context, args) {
        const res = execSync(args.bash).toString();
        await context.editOrReply(Markup.codeblock(res, {
            language: 'js',
            limit: 1990
        }));
    }
}