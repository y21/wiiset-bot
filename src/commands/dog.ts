import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'dog',
    ownerOnly: false,
    metadata: {
        description: 'Sends a random dog picture'
    },
    onrun: async function(client, context, args) {
        await context.reply(await client.restClient.dog());
    }
}