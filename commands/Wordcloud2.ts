import Command from "../structures/Command";
import Base from "../Base";
import {Channel, Collection, Message, Permissions, TextChannel} from "discord.js";

interface Word {
    s: string;
    a: number;
}

export default <Command>{
    name: "wordcloud2",
    description: "Sends a list of most used words in a channel",
    args: [{
        name: "channel",
        description: "A custom channel to use (needs to be a mention: <#channelID>)",
        required: false
    }],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: async (base: Base, message: any) => {
        const channel: Channel = message.mentions.channels.first() || message.channel;
        if (!(channel instanceof TextChannel)) throw new Error("Channel is not a text channel.");
        const memberPermissions: Permissions | null = channel.permissionsFor(message.member);
        const botPermissions: Permissions | null = channel.permissionsFor(message.guild.me);

        if (!memberPermissions) throw new Error("Permissions for member is null.");
        if (!botPermissions) throw new Error("Permissions for bot is null.");

        if (!memberPermissions.has("READ_MESSAGES"))
            throw new Error("You don't have permissions to view messages in that channel.");
        if (!botPermissions.has("READ_MESSAGES"))
            throw new Error("I don't have permissions to view messages in that channel.");

        const messages: Collection<string, Message> = await channel.fetchMessages({
            limit: 100
        });
        const words: Word[] = [];
        for (const msg of messages.values()) {
            for(let word of msg.content.split(" ")) {
                if (msg.author.bot) continue;
                if (!words.some(v => v.s === word)) words.push({
                    s: word,
                    a: 1});
                else {
                    const wordArr: Word | undefined = words.find(v => v.s === word);
                    if (!wordArr) continue;
                    wordArr.a++;
                }
            }
        }
        const filteredWords: string[] = words.sort((a,b) => b.a - a.a).slice(0, 100).map(v=>v.s.replace(/<@[&!]?(\d{15,22})>/g, "<@‍$1>"));
        return [filteredWords.join(" ").substr(0,1990), {
            code: ""
        }];
    }
}