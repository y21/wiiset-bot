import Command from "../structures/Command";
import Base from "../Base";
import { exec } from "child_process";

export default <Command>{
    name: "bash",
    description: "Executes a shell command",
    args: [{
        name: "command",
        description: "The command to be executed",
        required: true
    }],
    guildOnly: false,
    category: null,
    ownerOnly: true,
    run: (base: Base, message: any) => {
        return new Promise((a: any, b: any) => {
            const args: string[] = message.content.split(" ").slice(1);
            exec(args.join(" "), (error, stdout) => {
                if (error) return b(error);
                else a([stdout.toString()]);
            });
        });
    }
}