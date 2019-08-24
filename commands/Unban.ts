import Command from "../structures/Command";
import Base from "../Base";
import {Message, User} from "discord.js";

export default <Command>{
    name: "unban",
    description: "Unbans a user ID",
    args: [{
        name: "userid",
        description: "The User ID to unban.",
        required: true
    }],
    guildOnly: true,
    category: "mod",
    ownerOnly: false,
    run: (base: Base, message: Message) => {
        return new Promise((a: any, b: any) => {
            const args: string[] = message.content.split(" ").slice(1);
            if (!message.member.hasPermission("BAN_MEMBERS"))
                throw new Error("You don't have permissions to ban users which is required for the unban command.");
            message.guild.unban(args[1]).then((u: User) => {
                a(["Successfully unbanned " + u.tag]);
            }).catch(b);
        });
    }
}