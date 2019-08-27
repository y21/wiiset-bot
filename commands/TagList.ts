import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";
import Tag from "../structures/Tag";

export default <Command>{
    name: "tags",
    description: "Deletes one of your tags",
    args: [{
        name: "limit",
        description: "How many tags to get, must not be greater than 10. Default value is 10.",
        required: false,
    }],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: async (base: Base, message: Message) => {
        const args: string[] = message.content.split(" ").slice(1);
        const limit: number = parseInt(args[0]) || 10;
        const timestampBefore: number = Date.now();
        if (limit < 1 || limit > 10) throw new Error("Limit must be a number between 1 and 10.");
        return new Promise((a: any, b: any) => {
            base.sqlite.all("SELECT * FROM tags ORDER BY uses DESC LIMIT ?", limit).then((res: Tag[]) => {
                const timestampStm: number = Date.now();
                a([{
                    embed: {
                        title: "Tag list",
                        description: `Took ${timestampStm - timestampBefore}ms to fetch ${limit} tags.`,
                        fields: res.map((t: Tag) => ({
                            name: t.name,
                            value: `Uses: ${t.uses} | Creator: <@${t.author}>`
                        }))
                    }
                }]);
            }).catch(b);
        });
    }
}