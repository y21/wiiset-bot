import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import { formatDate } from '../utils/utils';

export default <Cmd>{
    name: 'mkw room',
    ownerOnly: false,
    metadata: {
        description: 'Displays room statistics'
    },
    onrun: async function(client, context, args) {
        const result = await client.restClient.wiimmfi.getMkwRoom(
            args[this.name]
        );

        const vr = result?.members.map(x => x.ev ?? 0) ?? [];
        const totalVr = vr.reduce((a, b) => a + b, 0) ?? 0;


        if (!result) {
            throw new Error('Room not found')
        }

        await context.editOrReply({
            embed: {
                title: `Room statistics (Room: ${result.room_name} | ID: ${result.room_id})`,
                color: 0x3498db,
                description: `This room was created ${formatDate(Date.now() - result.room_start * 1000)}. The last race started ${formatDate(Date.now() - result.race_start * 1000)}`,
                fields: [
                    {
                        name: 'Average VR',
                        value: String(~~(totalVr / vr.length))
                    },
                    {
                        name: 'Highest VR',
                        value: String(Math.max(...vr))
                    },
                    {
                        name: 'Lowest VR',
                        value: String(Math.min(...vr))
                    }
                ]
            }
        });
    }
}