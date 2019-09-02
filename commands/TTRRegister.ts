import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";
import {Profile} from "../structures/TTRProfile";
import fetch, {Response} from "node-fetch";

export default <Command>{
    name: "register",
    description: "Creates a Time Trial Royale profile",
    args: [],
    guildOnly: false,
    category: "ttr",
    ownerOnly: false,
    run: async (base: Base, message: Message, texts: any) => {
        const pidStatement: {
            pid: string;
            user: string
        } | undefined = await base.sqlite.get("SELECT * FROM pids WHERE user = ?", message.author.id);
        if (!pidStatement) throw new Error("Please set your CTGP Profile ID before creating a profile using `w.ctgp setpid <profileID>`");

        const ttrProfile: Profile | undefined = await base.sqlite.get("SELECT 1 FROM ttrProfiles WHERE user = ?", message.author.id);
        if (ttrProfile) throw new Error("Profile for " + message.author.id + " exists already.");

        const profile: Profile = {
            user: message.author.id,
            currentLobby: null,
            matches: 0,
            pid: pidStatement.pid,
            rating: 1000,
            wins: 0,
            submittedTime: null,
            channel: message.channel.id
        };

        const request: Response = await fetch(`http://tt.chadsoft.co.uk/players/${profile.pid.substr(0, 2)}/${profile.pid.substr(2)}.json`);
        const response: string = await request.text();

        if (request.headers.get("Content-Type") !== "application/json")
            throw new Error("An invalid profile ID was provided.");
        const rawResponse: any = JSON.parse(response.replace(/^\s+/, ""));
        profile.rating += (rawResponse.stars.bronze - rawResponse.stars.silver - rawResponse.stars.gold) + (rawResponse.stars.silver - rawResponse.stars.gold) * 4 + rawResponse.stars.gold * 8;
        await base.sqlite.run("INSERT INTO ttrProfiles VALUES (?, ?, ?, 0, 0, NULL, NULL, ?)", message.author.id, profile.pid, profile.rating, profile.channel);
        return [`Profile successfully created. Rating: ${profile.rating}`];
    }
}