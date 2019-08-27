import Command from "../structures/Command";
import Base from "../Base";
import { inspect } from "util";

export default <Command>{
    name: "eval",
    description: "Executes JavaScript code",
    args: [{
        name: "command",
        description: "The command to be executed",
        required: true
    }],
    guildOnly: false,
    category: null,
    ownerOnly: true,
    run: (base: Base, message: any) => {
        return new Promise(async (a: any, b: any) => {
            const args: string[] = message.content.split(" ").slice(1);

            const embed: any = {
                color: (message.member || {
                    displayColor: 0x00FF00
                }).displayColor,
                title: "Evaluation",
                fields: [{
                    name: "Input",
                    value: "```js\n" + args.join(" ") + "\n```"
                }]
            };
            const oldTimestamp: number = Date.now();
            let evaluation: any;
            try {
                evaluation = inspect(await eval(args.join(" "))).substr(0, 1000);
                embed.fields.push({
                    name: "Output",
                    value: "```js\n" + evaluation.replace(message.client.token, "[TOKEN REDACTED]") + "\n```"
                });
            } catch (e) {
                embed.fields.push({
                    name: "Output",
                    value: "```js\n" + e + "\n```"
                });
                embed.color = 0xFF0000
            }

            embed.fields.push({
                name: "Evaluation time",
                value: (Date.now() - oldTimestamp) + " Milliseconds"
            });

            a([{ embed }]);
        });
    }
}