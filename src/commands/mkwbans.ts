import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'mkw bans',
    ownerOnly: false,
    metadata: {
        description: 'Displays recent MKW bans'
    },
    disabled: true,
    onrun: async function(client, context, args) {
        // TODO
    }
}