import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import { randomFrom } from '../utils/utils';

export default <Cmd>{
    name: 'word',
    ownerOnly: false,
    metadata: {
        description: 'Responds with a random word'
    },
    onrun: async function(client, context, args) {
        // This command is stupid, but I've been asked many times to add it
        
        const wordParts = await context.rest.fetchMessages(context.channelId, {
            limit: 100
        }).then(x => randomFrom(x.toArray())?.content.split(' ') ?? []);

        const word = randomFrom(wordParts);

        await context.editOrReply({
            content: word ?? '-',
            allowedMentions: {}
        });
    }
}