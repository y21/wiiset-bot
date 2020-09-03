import Cmd from '../structures/basecommand';
import { Markup } from 'detritus-client/lib/utils';
import { flat, generateTable } from '../utils/utils';
import { DELIMITER } from '../utils/constants';

const SIZE = 20;

export default <Cmd>{
    name: 'mkw users',
    ownerOnly: false,
    metadata: {
        description: 'Displays users in rooms'
    },
    onrun: async function(client, context, args) {
        const users = await client.restClient.wiimmfi.getMkwUsers(
            args[this.name]
        );

        if (!users) return context.editOrReply('no players found!');

        const tableHeader = ['#', 'Player', 'VR'];

        await client.paginator.createReactionPaginator({
            message: context.message,
            pages: flat(users, SIZE, (_, i) => {
                return Markup.codeblock(generateTable({
                    header: tableHeader,
                    rows: [
                        Array(2).fill(DELIMITER.repeat(3))
                    ].concat(users.slice(i, i + SIZE).map((x, j) => ([
                        String(j + 1),
                        x.names?.[0] ?? '<unknown>',
                        x.ev === -1 ? '-' : x.ev.toLocaleString()
                    ]))),
                    offset: 4
                }), {
                    language: 'md',
                    limit: 1980
                });
            })
        });
    }
}