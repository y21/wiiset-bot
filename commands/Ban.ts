import Command from "../structures/Command";
import Base from "../Base";
import {GuildMember, Message, MessageCollector} from "discord.js";

export default <Command>{
    name: "ban",
    description: "Bans a user from this server",
    args: [{
        name: "user",
        description: "The user to ban. This needs to be either a mention or a user ID.",
        required: true
    }],
    guildOnly: true,
    category: "mod",
    ownerOnly: false,
    run: async (base: Base, message: Message, texts: any) => {
        if (!message.member.hasPermission("BAN_MEMBERS"))
            throw new Error(texts.no_permissions);
        let target: GuildMember | undefined;
        const args: string[] = message.content.split(" ").slice(1);
        if (message.mentions.members.size > 0)
            target = message.mentions.members.first();
        else if (/^\d{17,20}$/.test(args[1]))
            target = message.guild.members.get(args[1]) || await message.guild.fetchMember(args[1], false);

        if (!target) throw new Error(texts.user_not_found);

        const confirmMessage: Message | Message[] = await message.channel.send(
            texts.ban_confirmation
                .replace(/{target}/g, target.user.tag)
                .replace(/{reason}/g, args.slice(2).join(" "))
        );
        if (Array.isArray(confirmMessage))
            throw new Error("An internal error occurred: TextChannel.send(...) returned an array of messages.");
        const collector: MessageCollector = message.channel.createMessageCollector((m: Message) => true, {
            time: 15000,
            maxMatches: 1
        });

        collector.on("collect", (msg: Message) => {
            if (!target) return;
            if (msg.content.toLowerCase() === "y" || msg.content.toLowerCase() === "yes") {
                target.ban({
                    days: 7,
                    reason: "Banned by " + message.author.tag + ". Reason: " + args.slice(2).join(" ")
                }).then(() => {
                    if (!target) return;
                    confirmMessage.edit(texts.banned.replace(/{target}/g, target.user.tag));
                });
            } else if (msg.content.toLowerCase() === "n" || msg.content.toLowerCase() === "no") {
                confirmMessage.edit(texts.ban_aborted);
            }
        });
    }
}