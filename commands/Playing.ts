import Command from "../structures/Command";
import Base from "../Base";
import {Collection, User} from "discord.js";

export default <Command>{
    name: "playing",
    description: "Shows how many users play a specific game. This filters by the \"playing\" status.",
    args: [{
        name: "game",
        description: "The game that should be searched for",
        required: true
    }],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: (base: Base, message: any) => {
        const args = message.content.split(" ").slice(1);
        const users: Collection<string, User> = base.client.users.filter(u => {
            if (u.presence.game)
                return u.presence.game.name === args.join(" ");
            else return false;
        });
        return [`\`${users.size} are currently playing ${args.join(" ").replace(/`/g, "")}\``];
    }
}