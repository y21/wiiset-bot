import Command from "../structures/Command";
import Base from "../Base";
import {Message, MessageReaction, ReactionCollector, User} from "discord.js";
import * as TTRMatch from "../structures/TTRMatch";
import {Profile} from "../structures/TTRProfile";

export default <Command>{
    name: "lobbies",
    description: "Lists all Time Trial Royale matches",
    args: [],
    guildOnly: false,
    category: "ttr",
    ownerOnly: false,
    run: async (base: Base, message: Message, texts: any) => {
        let index: number = 0;
        let entriesPerPage: number = 5;
        const emojis: string[] = [
            "⬅",
            "➡"
        ];
        const matches: TTRMatch.Match[] = await base.sqlite.all("SELECT * FROM ttrMatches WHERE NOT state = ? LIMIT 50", TTRMatch.State.ENDED);
        if (!matches) throw new Error(`No ongoing matches. Create one by using ${base.config.prefix}ttr creatematch <options>`);
        const embed: any = {
            color: 0x0066DD,
            title: "Available rooms",
            description: `There are ${matches.length} matches.`,
            fields: matches.slice(index, index + entriesPerPage).map(async v => {
                return ({
                    name: `${v.id} (${v.participants.split(",").length} players)`,
                    value: (v.options === TTRMatch.MatchOptions.RTs ? "RTs" : "CTs") + " | " + TTRMatch.stateToString(v.state) + " | Round: " + v.round
                })
            })};

        const m: Message | Message[] = await message.channel.send({ embed });
        if (Array.isArray(m)) throw new Error;
        for (const emoji of emojis)
            await m.react(emoji);

        const collector: ReactionCollector = m.createReactionCollector((reaction: MessageReaction, user: User) => user.id === message.author.id && emojis.includes(reaction.emoji.name), {
            time: 180000
        });

        collector.on("collect", (r: MessageReaction) => {
            r.remove(message.author).catch(()=>{});
            if (r.emoji.name === emojis[0]) {
                if (index - entriesPerPage <= 0) return;
                index -= entriesPerPage;
            } else {
                if (index + entriesPerPage > matches.length) return;
                index += entriesPerPage;
            }

            embed.fields = matches.slice(index, index + entriesPerPage).map(v => ({
                name: `${v.id} (${v.currentPlayers.split(",").length} players)`,
                value: (v.options === TTRMatch.MatchOptions.RTs ? "RTs" : "CTs") + " | " + TTRMatch.stateToString(v.state) + " | Round: " + v.round
            }));
            m.edit({ embed });
        });
    }
}