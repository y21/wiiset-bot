import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import { GUILD_OWNER_CMD } from '../utils/constants';

export default <Cmd>{
    name: 'unregister',
    ownerOnly: false,
    metadata: {
        description: 'Removes WR Notifier from this channel'
    },
    disableDm: true,
    onrun: async function(client, context, args) {
        const guild = await context.rest.fetchGuild(context.guildId!);
        if (guild.ownerId !== context.userId) {
            throw new Error(GUILD_OWNER_CMD);
        }

        const webhook = await context.rest.fetchGuildWebhooks(context.guildId!)
            .then(x => x.find(webhook => webhook.name.toLowerCase() === args[this.name]));
        if (!webhook || !webhook.token) {
            throw new Error('Webhook not found!')
        }

        const ok = await client.restClient.removeWrNotifier(
            webhook.id,
            webhook.token
        );
        if (!ok) {
            throw new Error('An unknown error has occurred');
        }

        await webhook.delete();
    }
}