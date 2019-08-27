import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";
import fetch, {Response} from "node-fetch";

export default <Command>{
    name: "unregister",
    description: "Unregisters the WR Notifier",
    args: [{
        name: "webhookID",
        description: "The ID of the Webhook",
        required: true
    }, {
        name: "webhookToken",
        description: "The Token of the Webhook",
        required: true
    }],
    guildOnly: false,
    category: "ctgp",
    ownerOnly: false,
    run: (base: Base, message: Message) => {
        return new Promise(async (a: any, b: any) => {
            const args: string[] = message.content.split(" ").slice(1);
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return b("You're missing administrator permissions to use this command.");
            if (args.length !== 3)
                return b(`Command syntax: ${base.config.prefix}ctgp unregister <WebhookID> <WebhookToken>`);
            if (!/^\d{17,19}$/.test(args[1]))
                return b("That does not look like a valid Webhook ID");
            if (!/^[\w-]{50,90}$/.test(args[2]))
                return b("That does not look like a valid Webhook token");
            const request: Response = await fetch(`https://tt-webhook.glitch.me/unregister/${args[1]}/${args[2]}?key=${base.config.wrAuthToken}&server=${message.guild.id}`, {
                method: "POST"
            });
            const result: any = await request.json();
            if (result.status === 200)
                return a(["[HTTP 200:OK]: Webhook unregistered."]);
            else return b("[HTTP [???:???]: Could not delete Webhook.");
        });
    }
}