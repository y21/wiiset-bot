import Cmd from '../structures/basecommand';

export default <Cmd>{
    name: 'ctgp profile',
    ownerOnly: false,
    metadata: {
        description: 'Displays Time Trial statistics'
    },
    onrun: async function(client, context, args) {
        const result = await client.restClient.ctgp.getProfileInfo(
            args[this.name]
        );

        const bronzeStars = result.stars.bronze - result.stars.silver;
        const silverStars = result.stars.silver - result.stars.gold;
        const goldStars = result.stars.gold;

        let embedColor: number;

        if (result.stars.gold >= silverStars) {
            embedColor = 0xD4AF37;
        } else if (silverStars >= bronzeStars) {
            embedColor = 0xC0C0C0;
        } else {
            embedColor = 0xCD7F32;
        }

        await context.editOrReply({
            embed: {
                title: `Time Trial stats for ${result.miiName}`,
                color: embedColor,
                description: 'USB GCN Adapter attached: ' + (result.usbGcnAdapterAttached ? 'yes' : 'no') + '\n',
                fields: [
                    {
                        name: 'Stars',
                        value: `${bronzeStars} Bronze\n${silverStars} Silver\n${goldStars} Gold`
                    },
                    {
                        name: `Last 5 out of ${result.miiNames.length} names`,
                        value: result.miiNames.slice(0, 5).map(x => '`' + x + '`').join(', ') ?? '-'
                    },
                    {
                        name: 'Submitted ghosts',
                        value: String(result.ghostCount || 0)
                    },
                    {
                        name: 'Ghosts',
                        value: result.ghosts.slice(-5)
                            .map(x => x.trackName + ': ' + x.finishTimeSimple)
                            .join('\n')
                            + (result.ghosts.length > 5 ? `\n... ${result.ghosts.length - 5} more ghosts` : '')
                    }
                ]
            }
        });
    }
}