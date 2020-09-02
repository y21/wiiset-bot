import Cmd from '../structures/basecommand';
import { TTC_VERSION } from '../utils/constants';
import { Markup } from 'detritus-client/lib/utils';
import { generateTableWithBorder } from '../utils/utils';

export default <Cmd>{
    name: 'ttc users',
    ownerOnly: false,
    metadata: {
        description: 'Displays top 10 TTC users'
    },
    onrun: async function(client, context, args) {
        const users = await client.restClient.ttc.getUsers().then(x => x.slice(0, 9));

        await context.editOrReply({
            embed: {
                title: `Leaderboard | TT-Competition ${TTC_VERSION}`,
                color: 0x2ecc71,
                description: Markup.codeblock(
                    generateTableWithBorder({
                        header: ['#', 'ID', 'Rating'],
                        rows: users.map((x, i) => [i + 1, `<@${x.id}>`, x.rating.toLocaleString()])
                    })
                )
            }
        });
    }
}