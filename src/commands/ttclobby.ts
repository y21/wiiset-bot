import Cmd from '../structures/basecommand';
import Lobby, { LobbyOptions } from '../ttc/lobby';
import { hasOption } from '../utils/utils';

export default <Cmd>{
    name: 'ttc lobby',
    ownerOnly: false,
    metadata: {
        description: 'Displays lobby information'
    },
    onrun: async function(client, context, args) {
        const lobby = await client.restClient.ttc.getLobby(args[this.name]);

        // Sort players by their rating
        lobby.players.sort((a, b) => b.rating - a.rating);

        const fields = [
            {
                name: 'ID',
                value: lobby.id || '?'
            },
            {
                name: 'Creator',
                value: `<@${lobby.creator.id}>`
            },
            {
                name: 'Players',
                value: lobby.players
                    .slice(0, 10)
                    .map(x => `<@${x.id}> (Rating: ${x.rating})`).join('\n') || '-'
            },
            {
                name: 'Round',
                value: lobby.round || '-'
            },
            {
                name: 'Current Track',
                value: lobby.currentTrack?.name ?? '-'
            },
            {
                name: 'State',
                value: Lobby.stateToString(lobby.state) || '-'
            },
            {
                name: 'Options',
                value: Lobby.formatOptions(lobby.options) || '-'
            }
        ];

        if (hasOption(lobby.options, LobbyOptions.Teams)) {
            fields.push({
                name: 'Teams',
                value: lobby.teamsToString() || '-'
            });
        }

        await context.editOrReply({
            embed: {
                color: 0x2ecc71,
                fields
            }
        });
    }
}