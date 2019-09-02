import Command from "../structures/Command";
import Base from "../Base";
import {Channel, Collection, Message, Permissions, TextChannel} from "discord.js";

interface Word {
    s: string;
    a: number;
}

export default <Command>{
    name: "word",
    description: "Sends a random  word",
    args: [{
        name: "channel",
        description: "A custom channel to use (needs to be a mention: <#channelID>)",
        required: false
    }],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: async (base: Base, message: any) => {
        const command: Command | undefined = base.commands.get("wordcloud2");
        if (!command)
            throw new Error("Internal Error occured: wordcloud2 command was not found, which the word command inherits.");
        const words: string[] = await command.run(base, message);
        const filteredWords: string[] = words.filter(v => !v.startsWith("w.")).map(v => v.replace(/<@[&!]?(\d{15,22})>/g, "<@‍$1>"));
        return [filteredWords[Math.floor(Math.random() * filteredWords.length)]];
    }
}