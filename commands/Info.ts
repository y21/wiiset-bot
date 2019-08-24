import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";

export default <Command>{
    name: "info",
    description: "Sends general information about the bot, like server count and ping",
    args: [],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: (base: Base, message: Message) => {
        // TODO: write actual stats command
        return ["it works!!!"];
    }
}