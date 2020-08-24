import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'ctgp recent',
    ownerOnly: false,
    metadata: {
        description: ''
    },
    onrun: async function(client, context, args) {

    }
}