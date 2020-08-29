import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'ttc join',
    ownerOnly: false,
    metadata: {
        description: 'Joins a TTC Lobby'
    },
    disableDm: true,
    onrun: async function(client, context, args) {
        const [id, pw] = args[this.name].split(' ');
        if (id && isNaN(args[0])) {
            throw new Error('Invalid Lobby ID');
        }

        const lobby = await client.restClient.ttc.addPlayerToLobby(
            id,
            context.userId,
            context.channelId,
            pw
        )
    }
}