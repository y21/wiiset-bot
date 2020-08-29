import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'ttc register',
    ownerOnly: false,
    metadata: {
        description: 'Register on TTC using your CTGP Player ID'
    },
    onrun: async function(client, context, args) {
        const user = await client.restClient.ttc.registerUser(
            context.userId,
            args[this.name]
        );

        await context.editOrReply(`Successfully registered! New rating: ${user.rating}.`);
    }
}