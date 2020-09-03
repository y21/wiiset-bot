import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'cat',
    ownerOnly: false,
    metadata: {
        description: 'Sends a random cat image'
    },
    onrun: async function(client, context, args) {
        context.reply(await client.restClient.cat());
    }
}