import Command from "../structures/Command";
import Base from "../Base";
import {Message, MessageReaction, ReactionCollector, User} from "discord.js";
import fetch from "node-fetch";

export default <Command>{
    name: "users",
    description: "Sends a list of online players",
    args: [],
    guildOnly: false,
    category: "mkw",
    ownerOnly: false,
    run: (base: Base, message: any) => {
        return new Promise((a: any, b: any) => {
            fetch("https://wiimmfi.glitch.me/mkw/users").then((res: any) => res.json())
                .then(async (res: string[]) => {
                    const lengthPerEmbed = 10;
                    let index = 0;

                    const embed: any = {
                        description: "```hs\n--- Page 1/" +
                            Math.floor(res.length / lengthPerEmbed) + " ---\n" +
                            res.slice(index, index + lengthPerEmbed).join("\n") + "\n```",
                        footer: {
                            text: "Total players: " + res.length
                        }
                    };
                    const emojis = [
                        "⬅",
                        "➡"
                    ];
                    res = res.sort();
                    const m: Message = await message.channel.send({ embed });

                    for (let emoji of emojis)
                        await m.react(emoji);

                    const collector: ReactionCollector = m.createReactionCollector((r: MessageReaction, u: User) => message.author.id === u.id && (emojis.includes(r.emoji.name)), {
                        time: 60000
                    });
                    collector.on("collect", async (reaction: MessageReaction) => {
                        try {
                            if (reaction.emoji.name === emojis[1]) {
                                if (index + lengthPerEmbed > res.length) return;
                                index += lengthPerEmbed;
                            } else if (reaction.emoji.name === emojis[0]) {
                                if (index - lengthPerEmbed <= 0) return;
                                index -= lengthPerEmbed;
                            }

                            embed.description = "```hs\n--- Page " + Math.floor(index / lengthPerEmbed) + "/" +
                                Math.floor(res.length / lengthPerEmbed) + " ---\n" +
                                res.slice(index, index + lengthPerEmbed).join("\n") + "\n```";
                            await m.edit({ embed });
                            await reaction.remove(message.author);
                        } catch(e) {
                            console.log(e);
                        }
                    });
                });
        });
    }
}