import Command from "../structures/Command";
import Base from "../Base";
import {Guild, GuildMember, Message} from "discord.js";

export default <Command>{
    name: "info",
    description: "Sends general information about the bot, like server count and ping",
    args: [],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: (base: Base, message: Message, texts: any) => {
        return [{
            embed: {
                title: "Bot statistics",
                color: 0x00FF00,
                fields: [
                    {
                        name: texts.guilds,
                        value: base.client.guilds.size,
                        inline: true
                    },
                    {
                        name: texts.users,
                        value: base.client.users.size,
                        inline: true
                    },
                    {
                        name: texts.emojis,
                        value: base.client.emojis.size,
                        inline: true
                    },
                    {
                        name: texts.ping,
                        value: base.client.ping.toFixed(2),
                        inline: true
                    },
                    {
                        name: texts.uptime,
                        value: (base.client.uptime / 1000 / 60 / 60).toFixed(2) + " hours",
                        inline: true
                    },
                    {
                        name: texts.nodejs_ver,
                        value: process.version,
                        inline: true
                    }
                ]
            }
        }];
    }
}