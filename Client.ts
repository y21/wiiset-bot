import Base from "./Base";
import * as fs from "fs";
import Event from "./structures/EventData";
import Command, {CommandData} from "./structures/Command";

const base: Base = new Base({
    disableEveryone: true
});

// Events
fs.readdir("./events", async (err: any, files: string[]): Promise<void> => {
    if (err) return void console.log(err);

    for(const file of files.filter((v: string) => v.endsWith(".ts"))) {
        const module: Event = (await import(`./events/${file.split(".")[0]}`)).default;
        try {
            base.client.on(module.type, (...data: any[]) => module.run(base, ...data));
        } catch(e) {
            console.log(`[${module.type}]`, e.stack);
        }
    }
});

// Commands
fs.readdir("./commands", async (err: any, files: string[]): Promise<void> => {
    if (err) return void console.log(err);

    for(const file of files.filter((v: string) => v.endsWith(".ts"))) {
        const module: CommandData = (await import(`./commands/${file.split(".")[0]}`)).default;
        const command: Command = new Command(module);

        base.commands.set(command.name, command);
    }
});

base.client.login(base.config.token).catch(console.log);