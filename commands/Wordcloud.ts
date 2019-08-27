import Command from "../structures/Command";
import Base from "../Base";
import {Attachment, Channel, Collection, Message, Permissions, TextChannel} from "discord.js";
import Jimp = require("jimp");

interface Word {
    s: string;
    a: number;
}

export default <Command>{
    name: "wordcloud",
    description: "Sends an image representing the most used words in a channel",
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
        const filteredWords: string[] = words.filter(v => !v.s.startsWith("w.")).map(v => v.s.replace(/<@[&!]?(\d{15,22})>/g, "<@‍$1>"));

        return new Promise((a: any, b: any) => {
            new Jimp(1024, 1024, 0, async (err: any, image: Jimp) => {
                if (err) return b(err);
                const font1: any = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
                const font2: any = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
                const font3: any = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

                for(let i: number = 0; i < filteredWords.length; ++i) {
                    await image.print(i <= 3 ? font1 : (i <= 5 ? font2 : font3), Math.floor(Math.random() * 900), Math.floor(Math.random() * 900), filteredWords[i]);
                }
                const buffer: Buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
                a([new Attachment(buffer, "wordcloud.jpeg")]);
            });
        });
    }
}