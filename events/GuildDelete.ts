import Event from "../structures/EventData";
import Base from "../Base";
import {Guild, TextChannel} from "discord.js";

export default <Event>{
    type: "guildDelete",
    run: (base: Base, guild: Guild): any => {
        const channel = base.client.channels.get(Base.guildLogChannel);
        if (!(channel instanceof TextChannel)) return;
        channel.send({
            embed: {
                title: "We've lost a guild: " + guild.name,
                color: 0xFF0000,
                thumbnail: {
                    url: guild.iconURL
                },
                fields: [
                    {
                        name: "Members",
                        value: guild.memberCount
                    },
                    {
                        name: "Bot rate",
                        value: (guild.members.filter(m => m.user.bot).size / guild.memberCount * 100).toFixed(1) + "%"
                    }
                ]
            }
        });
    }
}