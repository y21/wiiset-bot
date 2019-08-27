import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";
import { readdirSync } from "fs";
const languages: string[] = readdirSync("./lang").map((lang: string) => lang.split(".")[0]);

export default <Command>{
    name: "lang",
    description: "Changes the local language for the bot.",
    args: [{
        name: "language",

    }],
    guildOnly: true,
    category: "mod",
    ownerOnly: false,
    run: async (base: Base, message: Message) => {
        const args: string[] = message.content.split(" ").slice(1);
        if (!message.member.hasPermission("MANAGE_GUILD")) throw new Error("This command requires MANAGE_GUILD permissions.");
        if (!args[1]) throw new Error("No language provided");
        if (!languages.includes(args[1])) throw new Error("Language not found.");
        const langStm: any = await base.sqlite.get("SELECT lang FROM languages WHERE guild=?", message.guild.id);
        if (langStm) {
            await base.sqlite.run("UPDATE languages SET lang=? WHERE guild=?", args[1], message.guild.id);
        } else {
            await base.sqlite.run("INSERT INTO languages VALUES (?, ?)", message.guild.id, args[1]);
        }
        return ["Local language updated."];
    }
}