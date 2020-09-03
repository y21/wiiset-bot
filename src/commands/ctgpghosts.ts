import Cmd from '../structures/basecommand';
import { flat } from '../utils/utils';
import { Page } from '../utils/constants';

export default <Cmd>{
    name: 'ctgp ghosts',
    ownerOnly: false,
    metadata: {
        description: 'Displays ghosts submitted by a user'
    },
    onrun: async function(client, context, args) {
        const result = await client.restClient.ctgp.getProfileInfo(
            args[this.name]
        );

        const {ghosts} = result;

        const pages = flat<Page>(ghosts, 5, (_, i) => ({
            embed: {
                title: `Ghosts of player ${result.miiName}`,
                fields: ghosts.slice(i, i + 5).map((x, j) => ({
                    name: x.trackName || 'Unknown',
                    value: `Finish time: ${x.finishTimeSimple}\n` +
                            `Fastest lap: ${x.finishTimeSimple}\n` +
                            `Engine class: ${x['200cc'] ? '200cc' : '150cc'}\n` +
                            `Star: ${x.stars ? (x.stars.gold ? 'Gold' : (x.stars.silver ? 'Silver' : (x.stars.bronze ? 'Bronze' : ''))) : '-'}`
                }))
            }
        }));

        await client.paginator.createReactionPaginator({
            pages,
            message: context.message
        })
    }
}