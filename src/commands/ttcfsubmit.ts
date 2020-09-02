import Cmd from '../structures/basecommand';
import { resolveUser } from '../utils/utils';
import { ConfirmationReactions } from '../utils/constants';

const EXAMPLE = 'w.ttc fsubmit @user 01:23.456';

export default <Cmd>{
    name: 'ttc fsubmit',
    ownerOnly: false,
    metadata: {
        description: 'Force submit a ghost (can only be used by lobby creators)'
    },
    onrun: async function(client, context, args) {
        const fargs = args[this.name]?.split(' ') ?? [];

        if (fargs.length < 2) {
            throw new Error('Missing arguments! Example usage: ' + EXAMPLE);
        }

        const [user, time] = fargs;

        const userId = resolveUser(user, context.userId);
        if (!userId) {
            throw new Error('Invalid user! Example usage: ' + EXAMPLE);
        }

        const commandMessage = await context.editOrReply({
            content: `<@${userId}>`,
            embed: {
                description: 'Do you really want to force-submit this time? Please double check that the given time matches your ghost!\n\n**' + time + '**',
                footer: {
                    text: 'Note: To prevent players from cheating, submitting a wrong time leads to a temporary TTC ban'
                }
            }
        });

        // TODO: change detritus-pagination to accept any type of reactions
        // TODO2: add raw event typings
        const paginator = await client.paginator.createReactionPaginator({
            message: context.message,
            reactions: {
                // @ts-ignore
                OK: ConfirmationReactions.OK,
                NO: ConfirmationReactions.NO
            },
            commandMessage,
            targetUser: userId
        });

        paginator.on('raw', async (data: any) => {
            const { emoji } = data;

            switch (emoji.name) {
                case ConfirmationReactions.OK:
                    try {
                        await client.restClient.ttc.forceSubmitGhost(
                            userId,
                            context.userId,
                            time,
                            fargs.slice(2).join(' ') || undefined
                        );

                        await commandMessage.edit({
                            content: 'Successfully submitted time!',
                            embed: null
                        });
                    } catch(e) {
                        await commandMessage.edit({
                            content: 'Could not submit time!',
                            embed: null
                        });
                    }
                break;
                case ConfirmationReactions.NO:
                    await commandMessage.edit({
                        content: 'Aborted',
                        embed: null
                    });
                break;
                default:
                    return;
            }

            paginator.stop();
        });
    }
}