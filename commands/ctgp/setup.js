const fetch = require("node-fetch");
const FormData = require("form-data");
const { wrAuthToken } = require("../../config.json");

module.exports = class Setup {
	static async run({ channel, member, reply, guild }) {
		if (guild.memberCount < 10) return reply("To avoid abuse, this feature is only available for servers with more than 10 users.");
		if (!member.hasPermission("ADMINISTRATOR")) return reply("Only users with administrator permissions can setup the WR Notifier.");
		if (!guild.me.hasPermission("MANAGE_WEBHOOKS")) return reply("I don't have permissions to create a webhook.");
		
		const notifMessage = await channel.send("Creating webhook...");
		const webhook = await channel.createWebhook("WR Notifier", "");
		await notifMessage.edit("Webhook created! Registering server...");

		const request = await fetch(`https://tt-webhook.glitch.me/register/${webhook.id}/${webhook.token}?key=${wrAuthToken}&server=${guild.id}`, {method:"POST"});
		const json = await request.json();
		
		if (json.status === 200) await notifMessage.edit(`[HTTP ${json.status}] Webhook registered.`);
		else if (json.status >= 500 && json.status < 600) {
			await notifMessage.edit(`[HTTP ${json.status}] An error occured on the WR Notification server: ${json.error}`);
			await webhook.delete();
		}
		else {
			await notifMessage.edit(`[HTTP ${json.status}] An error occured: ${json.error}`);
			await webhook.delete();
		}
	}
};
