const fetch = require("node-fetch");
const { wrAuthToken } = require("../../config.json");

module.exports = class Unregister {
	static async run({ args, channel, member, reply, guild, prefix }) {
        try {
        if (!member.hasPermission("ADMINISTRATOR")) return reply("Only users with administrator permissions can setup the WR Notifier.");
        if (args.length != 3) return reply(`Command syntax: ${prefix}ctgp unregister <WebhookID> <WebhookToken>`);
        if (!/^\d{17,19}$/.test(args[1])) return reply("That does not look like a valid webhook ID");
        if (!/^[\w-]{50,90}$/.test(args[2])) return reply("That does not look like a valid webhook token");
        const request = await fetch(`https://tt-webhook.glitch.me/unregister/${args[1]}/${args[2]}?key=${wrAuthToken}&server=${guild.id}`, {method:"POST"});
        const result = await request.json();
        if (result.status === 200) reply(`[HTTP ${result.status}] Webhook unregistered successfully.`);
        else reply(`[HTTP ${result.status}] Could not delete webhook.`);
        } catch(undefined) {
            reply("An unknown error occured.");
        }
	}
};
