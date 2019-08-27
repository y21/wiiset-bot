import Command from "../structures/Command";
import Base from "../Base";
import fetch, {Response} from "node-fetch";
import {Message, MessageReaction, ReactionCollector, User} from "discord.js";
import UserResolver from "../utils/UserResolver";
import {Ghost} from "../structures/Ghost";
import * as FlagHandler from "../structures/FlagHandler";

export default <Command>{
    name: "ghosts",
    description: "Sends a list of all ghosts the user has submitted to the CTGP ghost database",
    args: [{
        name: "user",
        description: "The profile to show ghosts from. This can be either a mention or a profile ID",
        required: true
    }],
    guildOnly: false,
    category: "ctgp",
    ownerOnly: false,
    run: (base: Base, message: Message, texts: any) => {
        return new Promise(async (a: any, b: any) => {
            const args: string[] = message.content.split(" ").slice(1);
            if (args.length === 1)
                return b(texts.ctgp_no_pid_provided);
                let pid: string | undefined;
                const flags: FlagHandler.Flag[] = FlagHandler.default.from(message.content);
                const trackFlag: FlagHandler.Flag | undefined = flags.find(v => v.full === "track" || v.pre === "t");
                if (message.mentions.users.size === 0) {
                    if (/.+#\d{4}^$/.test(args[1])) {
                        const user: User | undefined = UserResolver.getByTag(base.client.users, args[1]);
                        if (!user) return b(texts.user_not_found);
                        let pidStatement: any = await base.sqlite.get("SELECT pid FROM pids WHERE user = ?", user.id);
                        if (!pidStatement)
                            return b(texts.ctgp_no_pid_set);
                        pid = pidStatement.pid;
                    } else if (!/^[A-Z0-9]+$/.test(args[1])) return b(texts.ctgp_invalid_pid);
                } else {
                    let pidStatement: any = await base.sqlite.get("SELECT pid FROM pids WHERE user = ?", message.mentions.users.first().id);
                    if (!pidStatement)
                        return b(texts.ctgp_no_pid_set);
                    pid = pidStatement.pid;
                }
                if (!pid)
                    pid = args[1];

                let request: Response = await fetch(`http://tt.chadsoft.co.uk/players/${pid.substr(0, 2)}/${pid.substr(2)}.json`);
                let response: any = await request.text();
                if (request.headers.get("Content-Type") !== "application/json")
                    return b(texts.ctgp_invalid_pid);
                // Replace BOM
                response = JSON.parse(response.replace(/^\s+/, ""));

                const lengthPerEmbed = 5;
                let index = 0;
                const emojis: string[] = [
                    "⬅",
                    "➡"
                ];

                const embed: any = {
                    color: (message.member || { displayColor: 0 }).displayColor,
                    title: "Ghosts of player " + response.miiName,
                    fields: response.ghosts.slice(index, index + lengthPerEmbed).filter((v: Ghost) => trackFlag ? v.trackName === trackFlag.value : true).map((v: Ghost) => {
                        return {
                            name: v.trackName || texts.ctgp_unknown_track,
                            value: `${texts.ctgp_finish_time} ${v.finishTimeSimple}\n` +
                            `${texts.ctgp_fastest_lap} ${v.bestSplitSimple}\n` +
                            `${texts.ctgp_engine_class} ${v["200cc"] ? "200cc" : "150cc"}\n` +
                            `${texts.ctgp_star} ${v.stars ? (v.stars.gold ? "Gold" : (v.stars.silver ? "Silver" : (v.stars.bronze ? "Bronze" : ""))) : "-"}`
                        }
                    }),
                    footer: {
                        text: `Page ${Math.floor(index / lengthPerEmbed) + 1}/${Math.floor(response.ghosts.length / lengthPerEmbed)}`
                    }
                };

                const m: Message | Message[] = await message.channel.send({ embed });
                if (Array.isArray(m)) return b("Internal error occurred.");
                for(const emoji of emojis)
                    await m.react(emoji);

                const collector: ReactionCollector = m.createReactionCollector((r: MessageReaction, u: User) => u.id === message.author.id && emojis.includes(r.emoji.name), {
                    time: 180000
                });

                collector.on("collect", async (reaction: MessageReaction) => {
                    try {
                        if (reaction.emoji.name === emojis[1]) {
                            if (index + lengthPerEmbed > response.ghosts.length) return;
                            index += lengthPerEmbed;
                        } else if (reaction.emoji.name === emojis[0]) {
                            if (index - lengthPerEmbed < 0) return;
                            index -= lengthPerEmbed;
                        }

                        embed.fields = response.ghosts.slice(index, index + lengthPerEmbed).filter((v: Ghost) => trackFlag ? v.trackName === trackFlag.value : true).map((v: Ghost) => {
                            return {
                                name: v.trackName || "Unknown track name",
                                value: `Finish time: ${v.finishTimeSimple}\n` +
                                `Best lap: ${v.bestSplitSimple}\n` +
                                `Engine class: ${v["200cc"] ? "200cc" : "150cc"}\n` +
                                `Star: ${v.stars ? (v.stars.gold ? "Gold" : (v.stars.silver ? "Silver" : (v.stars.bronze ? "Bronze" : ""))) : "-"}`
                            }
                        });
                        embed.footer.text = `Page ${Math.floor(index / lengthPerEmbed) + 1}/${Math.floor(response.ghosts.length / lengthPerEmbed)}`;

                        await m.edit({embed});
                        await reaction.remove(message.author);
                    } catch(e) {
                        console.log(e);
                    }
                });
        });
    }
}