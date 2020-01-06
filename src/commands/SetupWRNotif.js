const fetch = require("node-fetch");
const { wrNotifierAPI } = require("../../configs/apis");
const { wrNotifierAuthToken } = require("../../configs/bot");

module.exports = {
    name: "setup",
    ownerOnly: false,
    guildOnly: false,
    run: async (context) => {
        const members = await context.rest.fetchGuildMembers(context.guildId, { limit: 10 });
        if (members.size < 10)
            throw new Error("To avoid spam, this feature is only available for servers with 10 or more members.");
        
        const guild = await context.rest.fetchGuild(context.guildId);
        if (guild.ownerId !== context.userId)
            throw new Error("Only the owner of this server can use this command");

        const webhook = await context.rest.createWebhook(context.channelId, {
            name: "WR Notifier"
        });

        const req = await fetch(`${wrNotifierAPI}/${webhook.id}/${webhook.token}?key=${wrNotifierAuthToken}`, {
            method: "POST"
        }).then(v => v.json());

        if (req.status === 200)
            return ["HTTP [200:OK]: Webhook registered."];
        else if (req.status >= 500 && req.status < 600) {
            throw new Error("HTTP [5xx:SERVER]: An error occurred on the WR Notification server, please send this error to y21#0909: " + req.error);
        }
        else {
            throw new Error("HTTP [???:???]: An unknown error occured: " + (req.error || ""));
        }
    }
};