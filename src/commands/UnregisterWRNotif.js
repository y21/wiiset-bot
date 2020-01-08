const fetch = require("node-fetch");
const { wrNotifierAPI } = require("../../configs/apis");
const { wrNotifierAuthToken } = require("../../configs/bot");

module.exports = {
    name: "unregister",
    ownerOnly: false,
    guildOnly: false,
    run: async (context, args) => {
        const guild = await context.rest.fetchGuild(context.guildId);
        if (guild.ownerId !== context.userId)
            throw new Error("Only the owner of this server can use this command");

        const webhook = await guild.fetchWebhooks().then(v => v.find(w => w.name === args.join(" ") || "WR Notifier"));

        if (!webhook) 
            throw new Error("Webhook not found");

        const req = await fetch(`${wrNotifierAPI}/unregister/${webhook.id}/${webhook.token}?key=${wrNotifierAuthToken}`, {
            method: "POST"
        }).then(v => v.json());

        if (req.status === 200)
            return ["HTTP [200:OK]: Webhook unregistered."];
        else {
            throw new Error("HTTP [???:???]: An unknown error occured: " + (req.error || ""));
        }
    }
};