import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";
import {Statement} from "sqlite";

export default <Command>{
    name: "delete",
    description: "Deletes one of your tags",
    args: [{
        name: "name",
        description: "The name of the tag that should be deleted.",
        required: true,
    }],
    guildOnly: false,
    category: "tag",
    ownerOnly: false,
    run: async (base: Base, message: Message, texts: any) => {
        const args: string[] = message.content.split(" ").slice(1);
        if (args.length < 2) throw new Error(texts.tag_nparams_delete.replace(/{prefix}/g, base.config.prefix));
        return new Promise((a: any, b: any) => {
            if (!Base.owner) return b("Internal error occurred: Base.owner returned undefined");
            if (message.author.id === Base.owner.id) {
                base.sqlite.run("DELETE FROM tags WHERE name = ?", args[1]).then((stm: Statement) => {
                    if (stm.changes >= 1)
                        return a([texts.tag_deleted]);
                    else return b(texts.tag_not_deleted);
                });
            } else {
                base.sqlite.run("DELETE FROM tags WHERE name = ? AND author = ?", args[1], message.author.id).then((stm: Statement) => {
                    if (stm.changes >= 1)
                        return a([texts.tag_deleted]);
                    else return b(texts.tag_not_deleted);
                });
            }
        });
    }
}