import Event from "../structures/EventData";
import Base from "../Base";
import {Guild, TextChannel} from "discord.js";

export default <Event>{
    type: "guildCreate",
    run: (base: Base, guild: Guild): any => {
        const channel = base.client.channels.get(Base.guildLogChannel);
        if (!(channel instanceof TextChannel)) return;
        channel.send({
            embed: {
                title: "A new guild: " + guild.name,
                color: 0x00FF00,
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
                ],
                footer: {
                    text: "Amount of guilds: " + base.client.guilds.size
                }
            }
        });
    }
}