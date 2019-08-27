import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";

export default <Command>{
    name: "bans",
    description: "Shows the most recent bans on Wiimmfi",
    args: [{
        name: "limit",
        description: "How many bans to fetch",
        required: false
    }],
    guildOnly: false,
    category: "mkw",
    ownerOnly: false,
    run: (base: Base, message: any, texts: any) => {
        return new Promise(async (a: any, b: any) => {
            const args: string[] = message.content.split(" ").slice(2);
            const limit: number = parseInt(args[0]) || 5;
            if (limit >= 10)
                return b(texts.mkw_ban_limit);

            const request = await fetch("https://wiimmfi.glitch.me/bans?limit=" + limit).then(r => r.json());

            a([{
                embed: {
                    title: texts.mkw_recent_bans,
                    fields: request.map((res: any) => {
                        return {
                            name: res.name || "Unknown name",
                            value: texts.mkw_ban_structure
                                .replace(/{reason}/g, res.reason
                                    .replace(/\n/g, ""))
                                .replace(/{ban_id}/g, res.ban_id
                                    .replace(/\n/g, ""))
                        }
                    })
                }
            }]);
        });
    }
}