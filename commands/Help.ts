import Command from "../structures/Command";
import Base from "../Base";
import {Message, MessageReaction, ReactionCollector, User} from "discord.js";

const reactions: string[] = ["⬅", "➡"];
interface Category {
    name: string;
    commands?: null | Command[];
}

export default <Command>{
    name: "help",
    description: "A list of useful information and all commands.",
    args: [],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: async (base: Base, message: Message) => {
        let index: any = 0;
        let commandsArray: Command[] = Array.from(base.commands).map(v => v[1]);
        const commandCategories: Category[] = [
            {
                name: "Information",
                commands: null
            },
            {
                name: "Uncategorized"
            },
            {
                name: "CTGP"
            },
            {
                name: "MKW"
            },
            {
                name: "Mod"
            },
            {
                name: "Tag"
            }
        ];
        for (const category of commandCategories.slice(1))
            category.commands = commandsArray.filter(v => v.category === (category.name === "Uncategorized" ? null : category.name.toLowerCase()));
        const embed: any = {
            title: `Help | Page 1/${Math.floor(base.commands.size / (commandCategories.length - 1))}`,
            color: 0x0066AA,
            description: "This bot is being developed by y21. It uses the Ghost Database API for CTGP commands and other external APIs for stuff like the cat command.\n" +
                "The code might have some bugs as there was a rewrite going on over the past few weeks. If you find one, please report it.\n" +
                "This help page will only work for the next 180 seconds (3 minutes).",
            fields: [
                {
                    name: "Related links",
                    value: "- Any questions or problems? Join our [support server](https://discord.gg/6DPWSmK).\n" +
                        "- [Invite me](https://discordapp.com/api/oauth2/authorize?client_id=440210686954569739&permissions=8&scope=bot) (administrator permissions, needed for moderation commands)\n" +
                        "- [Invite me](https://discordapp.com/api/oauth2/authorize?client_id=440210686954569739&permissions=0&scope=bot) (no permissions)\n" +
                        "- Want to see how this bot works? Take a look into the [source](https://github.com/y21/wiiset-bot).\n"
                }
            ],
            footer: {
                text: "<argument> = required argument | [<argument>] = optional argument"
            }
        };

        const m: Message | Message[] = await message.channel.send({ embed });
        if (Array.isArray(m)) return;

        for (const emoji of reactions)
            await m.react(emoji);

        const collector: ReactionCollector = m.createReactionCollector((reaction: MessageReaction, user: User) => user.id === message.author.id && reactions.includes(reaction.emoji.name), {
            time: 180000
        });

        collector.on("collect", (r: MessageReaction) => {
            r.remove(message.author).catch(()=>{});
            if (r.emoji.name === reactions[0]) {
                if (!commandCategories[index - 1]) return;
                index--;
            } else {
                if (!commandCategories[index + 1]) return;
                index++;
            }

            let category: Category = commandCategories[index];
            if (!category.commands) return;
            embed.title = `Help | Page ${index + 1}/${Math.floor(base.commands.size / (commandCategories.length - 1)) - 1}`;
            embed.fields = category.commands.map(v => ({
                name: base.config.prefix + (v.category === null ? "" : v.category + " ") + v.name + (v.args || []).map(a => a.required ? ` <${a.name}>` : ` [<${a.name}>]`).join(" "),
                value: v.description + (v.ownerOnly ? "(Owner-only)" : "") + (v.guildOnly ? "(Guild-only)" : "")
            }));
            embed.description = "";
            m.edit({ embed });
        });
    }
}