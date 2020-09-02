import Cmd from '../structures/basecommand';
import Lobby from '../ttc/lobby';
import { tierToString, getTier } from '../ttc/tier';

export default <Cmd>{
    name: 'ttc lobbies',
    ownerOnly: false,
    metadata: {
        description: 'Displays TTC lobbies'
    },
    onrun: async function(client, context, args) {
        const lobbies = await client.restClient.ttc.getLobbies()
            .then(x => x.sort((a, b) => b.players.length - a.players.length).slice(0, 10));

        await context.editOrReply({
            embed: {
                color: 0x2ecc71,
                fields: lobbies.map(x => ({
                    name: String(x.id),
                    value: `State: ${Lobby.stateToString(x.state)}\n` +
                        `Players: ${x.players.length} | Round: ${x.round}\n` +
                        `Tier: ${tierToString(getTier(x.creator.rating))}`
                })),
                footer: {
                    text: 'w.ttc join <id> | w.ttc lobby <id>'
                }
            }
        });
    }
}