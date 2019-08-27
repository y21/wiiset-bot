import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";
import {GuildChannel, Message, Permissions, TextChannel, Webhook} from "discord.js";

export default <Command>{
    name: "setup",
    description: "Sets up a Webhook in a channel, where every time someone beats a World Record, it sends a message containing information about the ghost.",
    args: [{
        name: "channel",
        description: "The channel where the webhook should be created. This needs to be a channel mention. If nothing is provided, it will use this channel.",
        required: false
    }],
    guildOnly: false,
    category: "ctgp",
    ownerOnly: false,
    run: (base: Base, message: any) => {
        return new Promise(async (a: any, b: any) => {
            if (message.guild.memberCount < 10)
                return b("To avoid abuse, this feature is only available for servers with 10 or more members.");
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return b("You need administrator permissions for this command.");
            const channel: GuildChannel = message.mentions.channels.first() || message.channel;
            const botPermissions: Permissions | null = channel.permissionsFor(message.guild.me);
            if (!botPermissions)
                return b("An internal error occurred: channel.permissionsFor(...) returned null");
            if (!botPermissions.has("MANAGE_WEBHOOKS"))
                return b("I don't have permissions to create webhooks in the given channel.");
            if (!(channel instanceof TextChannel))
                return b("Mentioned channel is not a Text Channel.");

            const webhook: Webhook = await channel.createWebhook("WR Notifier", "");
            const response = await fetch(`https://tt-webhook.glitch.me/register/${webhook.id}/${webhook.token}?key=${base.config.wrAuthToken}&server=${message.guild.id}`, {
                method: "POST"
            }).then((res: any) => res.json());

            if (response.status === 200)
                return a(["HTTP [200:OK]: Webhook registered."]);
            else if (response.status >= 500 && response.status < 600) {
                return b("HTTP [5xx:SERVER]: An error occurred on the WR Notification server, please send this error to y21#0909: " + response.error);
            }
            else {
                return b("HTTP [???:???]: An unknown error occured: " + (response.error || ""));
            }
        });
    }
}