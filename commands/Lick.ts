import Command from "../structures/Command";
import Base from "../Base";
import UserResolver from "../utils/UserResolver";
import {User} from "discord.js";

export default <Command>{
    name: "lick",
    description: "Lick someone (Thanks to <@131175247939502080>)",
    args: [{
        name: "user",
        description: "The user to lick",
        required: true
    }],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: async (base: Base, message: any) => {
        const args: string[] = message.content.split(" ").slice(1);
        let target: User | undefined;
        if (message.mentions.users.size > 0) target = message.mentions.users.first();
        else if (args && /^.+#\d{4}$/.test(args[0])) target = UserResolver.getByTag(base.client.users, args[0]);

        if (!target) throw new Error("User not found.");
        const dbUser: any = await base.sqlite.get("SELECT * FROM licks WHERE id = ?", target.id);
        let licks = 1;
        if (!dbUser)
            base.sqlite.run("INSERT INTO licks VALUES (?, 1)", target.id);
        else {
            base.sqlite.run("UPDATE licks SET amount=? WHERE id=?", dbUser.amount + 1, target.id);
            licks += dbUser.amount;
        }

        return [{
            embed: {
                color: 0x77b254,
                author: {
                    name: target.tag,
                    icon_url: target.displayAvatarURL
                },
                fields: [{
                        name: "Lick User",
                        value: "Paws successfully licked.",
                    },
                    {
                        name: "Total licks",
                        value: `${target.username}'s paws got licked ${licks} times`
                    },
                ],
                footer: {
                    text: `Licked by ${message.author.tag}`,
                    icon_url: message.author.displayAvatarURL
                }
            }
        }];
    }
}