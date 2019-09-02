import Command from "../structures/Command";
import Base from "../Base";
import {Message, MessageReaction, ReactionCollector, User} from "discord.js";
import * as TTRMatch from "../structures/TTRMatch";
import {Profile} from "../structures/TTRProfile";
import {Match} from "../structures/TTRMatch";

export default <Command>{
    name: "join",
    description: "Joins a TTR match",
    args: [{
        name: "lobbyID",
        description: "The Lobby ID",
        required: true
    }],
    guildOnly: false,
    category: "ttr",
    ownerOnly: false,
    run: async (base: Base, message: Message, texts: any) => {
        const args: string[] = message.content.split(" ").slice(1);
        const profile: Profile | undefined = await base.sqlite.get("SELECT 1 FROM ttrProfiles WHERE user = ?", message.author.id);
        if (!profile) throw new Error(`Profile not found. Create one by using ${base.config.prefix}ttr register`);


        if (profile.currentLobby)
            throw new Error("Currently in a lobby, please complete the current match before joining a new one.");

        if (!args[1]) throw new Error("No ID given");
        const targetMatch: { participants: string } | undefined = await base.sqlite.get("SELECT participants FROM ttrMatches WHERE NOT state = ? AND id = ?", TTRMatch.State.ENDED, args[1]);
        if (!targetMatch) throw new Error("Match with given ID has either ended or does not exist.");
        await base.sqlite.run("UPDATE ttrProfiles SET currentLobby = ? WHERE user = ?", args[1], message.author.id);
        return ["Lobby joined."];
    }
}