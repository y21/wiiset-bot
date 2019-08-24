import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";

export default <Command>{
    name: "create",
    description: "Creates a tag",
    args: [{
        name: "name",
        description: "The tag name. It can only include alphanumeric characters and hyphen-minus and must not be longer than 30 characters.",
        required: true,
    }, {
        name: "content",
        description: "The contents of the tag",
        required: true
    }],
    guildOnly: false,
    category: "tag",
    ownerOnly: false,
    run: async (base: Base, message: Message) => {
        const args: string[] = message.content.split(" ").slice(1);
        if (args.length < 2) throw new Error("Missing arguments.");
        if (args[1].length > 30) throw new Error("Tag name must not be longer than 30 characters.");
        if(!/[\w\-]{1,16}/.test(args[1])) throw new Error("Invalid tag name. Make sure it only includes alphanumeric characters and hyphen-minus.");
        const tagStatement: any = await base.sqlite.get("SELECT * FROM tags WHERE name = ?", args[1]);
        if (tagStatement) throw new Error("Tag already exists.");
        await base.sqlite.run("INSERT INTO tags VALUES (?, ?, ?, ?, ?)", args[1], message.author.id, args.slice(2).join(" "), Date.now(), 0);
        return ["Tag successfully created."]
    }
}