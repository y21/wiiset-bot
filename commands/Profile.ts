import Command from "../structures/Command";
import Base from "../Base";
import {Message, User} from "discord.js";
import UserResolver from "../utils/UserResolver";
import fetch, {Response} from "node-fetch";
import { readFileSync } from "fs";
import {Ghost} from "../structures/Ghost";
const countryCodes: any = JSON.parse(readFileSync("./countryCodes.json", "utf8"));
const controllerCodes: any = JSON.parse(readFileSync("./controllerCodes.json", "utf8"));

export default <Command>{
    name: "profile",
    description: "Shows Time Trial information about a user",
    args: [{
        name: "user",
        description: "The user to show information for, this can be either a mention, a tag or a profile ID",
        required: true
    }],
    guildOnly: false,
    category: "ctgp",
    ownerOnly: false,
    run: (base: Base, message: Message) => {
        return new Promise(async (a: any, b: any) => {
            const args: string[] = message.content.split(" ").slice(1);
            if (args.length === 1)
                return b("No player ID provided.");
                let pid: string | undefined;
                if (message.mentions.users.size === 0) {
                    if (/^.+#\d{4}$/.test(args[1])) {
                        const user: User | undefined = UserResolver.getByTag(base.client.users, args[1]);
                        if (!user)
                            return b("User not found.");
                        let pidStatement: any = await base.sqlite.get("SELECT pid FROM pids WHERE user=?", user.id);
                        if (!pidStatement)
                            return b("User does not have a profile ID attached to their profile.");
                        pid = pidStatement.pid;
                    }  else if (!/^[A-Z0-9]+$/.test(args[1])) return b("Invalid Profile ID provided.");
                } else {
                    const pidStatement: any = await base.sqlite.get("SELECT pid FROM pids WHERE user=?", message.mentions.users.first().id);
                    if (!pidStatement) return b("User does not have a profile ID attached to their profile.");
                    pid = pidStatement.pid;
                }
                if (!pid) pid = args[1];

                const request: Response = await fetch(`http://tt.chadsoft.co.uk/players/${pid.substr(0, 2)}/${pid.substr(2)}.json`);
                const response: string = await request.text();

                if (request.headers.get("Content-Type") !== "application/json")
                    return b("An invalid profile ID was provided.");
                const rawResponse: any = JSON.parse(response.replace(/^\s+/, ""));

                const bronzeStars: number = rawResponse.stars.bronze - rawResponse.stars.silver;
                const silverStars: number = rawResponse.stars.silver - rawResponse.stars.gold;
                const goldStars: number = rawResponse.stars.gold;

                let embedColor: number;
                if (rawResponse.stars.gold >= silverStars) embedColor = 0xD4AF37;
                else if (silverStars >= bronzeStars) embedColor = 0xC0C0C0;
                else embedColor = 0xCD7F32;
                a([{
                    embed: {
                        title: "Time Trial information about " + rawResponse.miiName,
                        color: embedColor,
                        description: "USB GCN Adapter attached: " + (rawResponse.usbGcnAdapterAttached ? "yes" : "no") + "\n" +
                            "Controller: " + (controllerCodes[rawResponse.controller] || "unknown") + "\n" +
                            "Country: " + (countryCodes[rawResponse.country] || "unknown"),
                        fields: [{
                            name: "Stars",
                            value: `${bronzeStars} Bronze\n${silverStars} Silver\n${goldStars} Gold`
                        },
                            {
                                name: "Last 5 out of " + (rawResponse.miiNames.length < 5 ? "<5" : rawResponse.miiNames.length - 5) + " Mii names",
                                value: rawResponse.miiNames.slice(0, 5).map((e: string) => "`" + e + "`").join(", ")
                            },
                            {
                                name: "Submitted ghosts",
                                value: rawResponse.ghostCount || 0
                            },
                            {
                                name: "Ghosts",
                                value: rawResponse.ghosts.slice(0, 5).map((e: Ghost) => e.trackName + ": " + e.finishTimeSimple).join("\n") + (rawResponse.ghosts.length > 4 ? "\n... and " + (rawResponse.ghosts.length - 5) + " more. (" + rawResponse.ghosts.length + " total ghosts)" : "")
                            }
                        ]
                    }
                }])
        });
    }
}