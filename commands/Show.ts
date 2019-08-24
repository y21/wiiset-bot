import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";
import Tag from "../structures/Tag";

export default <Command>{
    name: "show",
    description: "Displays a tags content",
    args: [{
        name: "tag-name",
        description: "The tag name",
        required: true,
    }],
    guildOnly: false,
    category: "tag",
    ownerOnly: false,
    run: async (base: Base, message: Message) => {
        const args: string[] = message.content.split(" ").slice(1);
        return new Promise((a: any, b: any) => {
            base.sqlite.get("SELECT * FROM tags WHERE name = ?", args[1]).then(async (res: Tag) => {
                await base.sqlite.run("UPDATE tags SET uses = uses + 1 WHERE name = ?", args[1]);
                a([">>> " + res.content.replace(/<@(\d+)>/g, `<@\u200b$1>`)]);
            }).catch(b);
        });
    }
}