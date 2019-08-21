import Base from "../Base";
import { Message } from "discord.js";
import Event from "../structures/EventData";
import Command from "../structures/Command";

export default <Event>{
    type: "message",
    run: async (base: Base, message: Message): Promise<any> => {
        // TODO: remove
        if (message.author.id !== "312715611413413889") return;
        if (!Base.owner) return console.log("Base.owner is undefined");

        if (message.author.bot || !message.content.startsWith(base.config.prefix)) return;
        const {config} = base;
        const args: string[] = message.content.split(" ").slice(1);
        const arg1: string = message.content.split(" ")[0].substr(config.prefix.length);
        let command: Command | undefined;

        if (base.commands.has(arg1))
            command = base.commands.get(arg1);
        else if (args.length > 0 && base.commands.has(args[0])) {
            command = base.commands.get(args[0]);
        }

        if (!command) return;
        if (command.category !== null && command.category !== arg1) return;
        if (command.ownerOnly && message.author.id !== Base.owner.id) return message.reply("You cannot execute this command.");
        let commandResponse: string[] | undefined;
        try {
            commandResponse = await command.run(base, message);
        } catch(e) {
            await message.reply("❌ | An error occurred while trying to run the command.\n ```\n" + e + "\n```");
        }
        if (!commandResponse) return;
        message.channel.send(...commandResponse);
    }
}