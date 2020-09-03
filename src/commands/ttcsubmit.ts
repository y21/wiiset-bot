import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'ttc submit',
    ownerOnly: false,
    metadata: {
        description: 'Submits a ghost'
    },
    onrun: async function(client, context, args) {
        await client.restClient.ttc.submitGhost(
            args[this.name],
            context.userId,
            context.channelId
        );

        await context.editOrReply(`Successfully submitted ghost!`);
    }
}