import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'ttc leave',
    ownerOnly: false,
    metadata: {
        description: 'Leaves the current TTC Lobby'
    },
    onrun: async function(client, context, args) {
        await client.restClient.ttc.removePlayerFromLobby(
            args[this.name] || undefined,
            context.userId,
            context.channelId
        );

        await context.editOrReply('Successfully left lobby!');
    }
}