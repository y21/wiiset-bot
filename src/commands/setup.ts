import Cmd from '../structures/basecommand';
import { GUILD_OWNER_CMD } from '../utils/constants';

export default <Cmd>{
    name: 'setup',
    ownerOnly: false,
    metadata: {
        description: 'Sets up WR Notifier in this channel'
    },
    disableDm: true,
    onrun: async function(client, context, args) {
        const hasMembers = await context.rest.fetchGuildMembers(
            context.guildId!,
            {
                limit: 10
            }
        ).then(x => x.size >= 10);

        if (!hasMembers) {
            throw new Error('To prevent spam, this feature is only available for servers with more than 10 members.');
        }

        const guild = await context.rest.fetchGuild(context.guildId!);
        if (guild.ownerId !== context.userId) {
            throw new Error(GUILD_OWNER_CMD);
        }

        const webhook = await context.rest.createWebhook(context.channelId, {
            name: 'WR Notifier'
        });

        if (!webhook.token) {
            throw new Error('webhook.token is not available');
        }

        const ok = await client.restClient.registerWrNotifier(
            webhook.id,
            webhook.token
        );

        if (ok) {
            await context.editOrReply('Webhook registered.');
        } else {
            throw new Error('An unknown error has occurred.');
        }
    }
}