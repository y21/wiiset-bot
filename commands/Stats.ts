import Command from "../structures/Command";
import Base from "../Base";

export default <Command>{
    name: "stats",
    description: "Sends general information about the bot, like server count and ping",
    args: [],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: (base: Base, message: any) => {
        // TODO: write actual stats command
        return ["it works!!!"];
    }
}