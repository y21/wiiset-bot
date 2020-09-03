import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'ctgp recent',
    ownerOnly: false,
    metadata: {
        description: 'Displays recently set World Records'
    },
    onrun: async function(client, context, args) {
        const response = await client.restClient.ctgp.getStats()
            .then(x => x.recentRecords);

        await context.editOrReply({
            embed: {
                title: 'Recent World Records',
                color: 0x00FF00,
                fields: response.slice(0, 6).map(x => ({
                    name: x.player || '???',
                    value: 'Track: ' + x.trackName +
                        '\nTrack version: ' + (x.trackVersion || 'Default') +
                        '\nTime: `' + x.finishTimeSimple + '`' +
                        '\nEngine class: `' + (x['200cc'] ? '200cc' : '150cc') + '`'
                }))
            }
        });        
    }
}