import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import { flat } from '../utils/utils';

export default <Cmd>{
    name: 'help',
    ownerOnly: false,
    metadata: {
        description: 'Lists all commands'
    },
    onrun: async function(client, context, args) {
        const {commands} = client.commandClient;
        const prefix = client.commandClient.prefixes.custom.first();

        console.log(flat(commands, 5, (_, i) => ({
                embed: {
                    title: 'Help',
                    fields: commands.slice(i, i + 5)
                    .map(x => ({
                        name: prefix + x.name,
                        value: String(x.metadata.description) || '*No description found*'
                    }))
                }
            })))

        await client.paginator.createReactionPaginator({
            message: context.message,
            pages: flat(commands, 5, (_, i) => ({
                embed: {
                    title: 'Help',
                    fields: commands.slice(i, i + 5)
                    .map(x => ({
                        name: prefix + x.name,
                        value: String(x.metadata.description) || '*No description found*'
                    }))
                }
            }))
        });
    }
}