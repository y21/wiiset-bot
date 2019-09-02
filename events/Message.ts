import Base from "../Base";
import { Message } from "discord.js";
import Event from "../structures/EventData";
import Command from "../structures/Command";
import * as FlagHandler from "../structures/FlagHandler";

export const IGNORED_COMMANDS: string[] = [
    "ttr/*",
];

export default <Event>{
    type: "message",
    run: async (base: Base, message: Message): Promise<any> => {
        if (!Base.owner) return console.log("Base.owner is undefined");

        if (message.author.bot || !message.content.startsWith(base.config.prefix)) return;
        const {config} = base;
        const args: string[] = message.content.split(" ").slice(1);
        const arg1: string = message.content.split(" ")[0].substr(config.prefix.length);
        const flags: FlagHandler.Flag[] = FlagHandler.default.from(message.content);
        let command: Command | undefined;

        if (base.commands.has(arg1))
            command = base.commands.get(arg1);
        else if (args.length > 0 && base.commands.has(args[0])) {
            command = base.commands.get(args[0]);
        }

        if (!command) return;
        if (command.category !== null && command.category !== arg1) return;
        if (command.ownerOnly && message.author.id !== Base.owner.id) return message.reply("You cannot execute this command.");
        if (command.guildOnly && !message.guild) return message.reply("This command only works in servers.");

        if (IGNORED_COMMANDS.some((v: string) => {
            if (!command) return;
            const parts: string[] = v.split("/");
            return command.category ? command.category === parts[0] && (parts[1] === "*" || command.name === parts[1]) : command.name === parts[0];
        })) return message.reply("this command has been disabled.");

        // Cooldown check
        {
            const lastMsg = base.messages.get(message.author.id);
            if (lastMsg !== undefined && Date.now() - lastMsg < 1000)
                return message.reply("no spamming.");
            else base.messages.set(message.author.id, Date.now());
        }

        // Increase command in database
        base.sqlite.get("SELECT * FROM commandstats WHERE name=?", (command.category ? command.category + "." + command.name : command.name)).then((result: any) => {
            if (!result && command) {
                base.sqlite.run("INSERT INTO commandstats VALUES (?, 1, ?)", (command.category ? command.category + "." + command.name : command.name), Date.now());
            } else if (command)
                base.sqlite.run("UPDATE commandstats SET uses = uses + 1, lastUsage=? WHERE name=?", Date.now(), (command.category ? command.category + "." + command.name : command.name));
        });

        let language: string = "en";
        if (message.guild) {
            const stm: any = await base.sqlite.get("SELECT lang FROM languages WHERE guild = ?", message.guild.id);
            if (stm)
                language = stm.lang;
        }
        let commandResponse: string[] | undefined;
        try {
            commandResponse = await command.run(base, message, base.texts[language].commands);
        } catch(e) {
            await message.reply("❌ | An error occurred while trying to run the command.\n ```\n" + e + "\n```");
        }
        if (!commandResponse) return;
        if (!flags.some(v => v.pre === "s" || v.full === "silent"))
            message.channel.send(...commandResponse);
    }
}