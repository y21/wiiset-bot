import Command from "../structures/Command";
import Base from "../Base";
import fetch, {Response} from "node-fetch";
import { readFileSync } from "fs";
import {Ghost} from "../structures/Ghost";
import {Message} from "discord.js";
const countryCodes: any = JSON.parse(readFileSync("./countryCodes.json", "utf8"));

export default <Command>{
    name: "leaderboard",
    description: "Sends the top 10 ghosts of a track.",
    args: [
        {
            name: "engineClass",
            description: "The engine class, can be either 150cc or 200cc.",
            required: true
        },
        {
            name: "track",
            description: "The track. This can be either a custom track or a regular track, but it needs to be in CTGP.",
            required: true
    }],
    guildOnly: false,
    category: "ctgp",
    ownerOnly: false,
    run: (base: Base, message: Message) => {
        return new Promise(async (a: any, b: any) => {
            const args: string[] = message.content.split(" ").slice(1);
            const limit: number = 10;
            const engineClass: string = args[1];
            if (args.length < 3)
                return b("No track name was provided .");
            if (engineClass !== "150cc" && engineClass !== "200cc")
                return b("Engine Class parameter needs to be either 150cc or 200cc.");
            const track = base.tracks.find((v: any) => v.name.toLowerCase() === args.slice(2).join(" ").toLowerCase());
            const timestampBefore: number = Date.now();
            const request: string = await fetch(`http://tt.chadsoft.co.uk${track.href.replace(/00\.json$/, engineClass === "200cc" ? "04.json" : "00.json")}`).then((v: any) => v.text());
            const response: any = JSON.parse(request.replace(/^\s+/, ""));
            const ghosts: Ghost[] = [];

            for (const ghost of response.ghosts) {
                if (ghosts.some((v: any) => v.player === ghost.player)) continue;
                ghosts.push(ghost);
            }

            a([`Took ${((Date.now() - timestampBefore) / 1000).toFixed(2)} seconds to fetch`, {
                embed: {
                    color: (message.member || { displayColor: 0x00FF00 }).displayColor,
                    title: "Top 10 ghosts for " + track.name,
                    fields: ghosts.slice(0, limit).map((v: Ghost, i: number) => ({
                        name: `#${i + 1} ${v.player}`,
                        value: "Time: `" + v.finishTimeSimple + "`\n"
                        + "Country: " + (countryCodes[v.country || ""] || "???")
                    }))
                }
            }])
        });
    }
}