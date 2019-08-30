import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";
import {Profile} from "../structures/TTRProfile";
import fetch, {Response} from "node-fetch";
import * as TTRMatch from "../structures/TTRMatch";
import {randomBytes} from "crypto";

export default <Command>{
    name: "creatematch",
    description: "Creates a Time Trial Royale match",
    args: [{
        name: "option",
        description: "Match options, seperate by comma. Possible match options are: RTs, CTs. Example: ttr creatematch rts,cts"
    }],
    guildOnly: false,
    category: "ttr",
    ownerOnly: false,
    run: async (base: Base, message: Message, texts: any) => {
        const args: string[] = message.content.split(" ").slice(1);
        const profile: Profile | undefined = await base.sqlite.get("SELECT 1 FROM ttrProfiles WHERE user = ?", message.author.id);
        if (!profile) throw new Error(`Profile not found. Create one by using ${base.config.prefix}ttr register`);

        if (profile.currentLobby)
            throw new Error("Currently in a lobby, please complete the current match before creating a new one.");

        if (!args[1])
            throw new Error("Invalid match options");

        const options: any[] = args[1].split(",");
        for(let option of options) {
            const val: number | undefined = (Object.entries(TTRMatch.MatchOptions).find(v => v[0].toLowerCase() === option.toLowerCase()) || [])[1];
            if (!val) throw new Error("Invalid match option: " + option);
            else option = val;
        }

        if (!Object.keys(TTRMatch.MatchOptions).some(v => v.toLowerCase() === args[1].toLowerCase())) throw new Error("Invalid match option.");
        const matchID: string = randomBytes(48).toString("hex").substr(0, 8);
        const match: TTRMatch.Match = {
            id: matchID,
            participants: message.author.id,
            state: TTRMatch.State.WAITING,
            options: options.reduce((a, b) => a | b),
            round: 0,
            createdAt: Date.now().toString(),
            currentPlayers: message.author.id,
            course: null,
            startedAt: null,
            givenTime: null
        };

        await base.sqlite.run("INSERT INTO ttrMatches VALUES (?, ?, ?, ?, 0, ?, ?, null, ?, null)",
            match.id,
            match.participants,
            TTRMatch.State.WAITING,
            match.options,
            Date.now(),
            Date.now(),
            match.currentPlayers);
        return [`Lobby successfully created. Others can now use \`${base.config.prefix}ttr join ${match.id}\` to join this lobby.`];
    }
}