import Cmd from '../structures/basecommand';
import { getCorrectTrackHash, flat } from '../utils/utils';
import { Page } from '../utils/constants';

export default <Cmd>{
    name: 'ctgp leaderboard',
    ownerOnly: false,
    metadata: {
        description: 'Fetches top ghosts on a specific track'
    },
    onrun: async function(client, context, args) {
        const track = client.trackHelper.findTrack(args[this.name]);

        if (!track) return context.editOrReply('Track not found');

        const { ghosts } = await client.restClient.ctgp.getTrack(getCorrectTrackHash(track));
        
        const pages = flat<Page>(ghosts, 5, (_, i) => ({
            embed: {
                title: `Top ghosts for ${track.name}`,
                fields: ghosts.slice(i, i + 5).map((x, j) => ({
                    name: `#${j + 1} ${x.player}`,
                    value: `Time: ${x.finishTimeSimple}\n`
                }))
            }
        }));

        client.paginator.createReactionPaginator({
            pages,
            message: context.message
        });
    }
}