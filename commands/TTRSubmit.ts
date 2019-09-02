import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";
import * as TTRMatch from "../structures/TTRMatch";
import {Profile} from "../structures/TTRProfile";
import fetch, {Response} from "node-fetch";
import {Ghost} from "../structures/Ghost";
import TTR from "../structures/TTR";

function validGhost(ghost: Ghost, match: TTRMatch.Match): boolean {
    return Number(match.startedAt) < Number(new Date(ghost.dateSet));
}

export default <Command>{
    name: "submit",
    description: "Submits the most recent time that was uploaded onto the ghost database",
    args: [],
    guildOnly: false,
    category: "ttr",
    ownerOnly: false,
    run: async (base: Base, message: Message, texts: any) => {
        const profile: Profile | undefined = await base.sqlite.get("SELECT * FROM ttrProfiles WHERE user = ?", message.author.id);
        if (!profile) throw new Error("Match not found.");
        const match: TTRMatch.Match | undefined = await base.sqlite.get("SELECT * from ttrMatches WHERE id = ?", profile.currentLobby);
        if (!match || match.state !== TTRMatch.State.INGAME) throw new Error("Not in an ongoing match.");

        const request: Response = await fetch(`http://tt.chadsoft.co.uk/players/${profile.pid.substr(0,2)}/${profile.pid.substr(2)}.json`);
        const response: string = await request.text();
        const responseJSON: any = JSON.parse(response.replace(/^[^{]+/, ""));
        const targetGhost: Ghost = responseJSON.ghosts.find((v: Ghost) => !v["200cc"] && v.trackName === match.course && v.dateSet && validGhost(v, match));

        if (!targetGhost) throw new Error("Cannot find a ghost for this track. Try again in a few seconds...");
        const time: number = TTR.textToTime(targetGhost.finishTimeSimple);
        await base.sqlite.run("UPDATE ttrProfiles SET submittedTime = ? WHERE user = ?", time, message.author.id);
        await message.reply("Successfully submitted ghost with a time of `" + targetGhost.finishTimeSimple + "`. (" + time + ")");
    }
}