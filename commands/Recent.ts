import Command from "../structures/Command";
import Base from "../Base";
import fetch, {Response} from "node-fetch";
import {Message, MessageReaction, ReactionCollector, User} from "discord.js";
import {Ghost} from "../structures/Ghost";

export default <Command>{
    name: "recent",
    description: "Sends a list of all ghosts the user has submitted to the CTGP ghost database",
    args: [{
        name: "limit",
        description: "The amount of World Records to fetch. When no argument is given, it will show 5.",
        required: false
    }],
    guildOnly: false,
    category: "ctgp",
    ownerOnly: false,
    run: (base: Base, message: Message) => {
        return new Promise(async (a: any, b: any) => {
            const args: string[] = message.content.split(" ").slice(1);
            fetch("http://tt.chadsoft.co.uk/index.json").then((res: any) => res.text())
                .then((res: any) => {
                    const response: Ghost[] = JSON.parse(res.replace(/^\s+/, "")).recentRecords;
                    const limit: number = parseInt(args[1]) || 5;
                    if (limit < 1 || limit > 10)
                        return b("Limit must be greater than 0 and less than 11");
                    a([{
                        embed: {
                            title: "Recent World Records set",
                            color: (message.member || { displayColor: 0x00FF00 }).displayColor,
                            fields: response.slice(0, limit).map(v => ({
                                name: v.player || "???",
                                value: "Track: " + v.trackName +
                                    "\nTrack version: " + (v.trackVersion || "Default") +
                                    "\nTime: `" + v.finishTimeSimple + "`" +
                                    "\nEngine class: `" + (v["200cc"] ? "200cc" : "150cc") + "`"
                            }))
                        }
                    }]);
                });
        });
    }
}