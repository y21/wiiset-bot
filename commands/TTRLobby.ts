import Command from "../structures/Command";
import Base from "../Base";
import {Message, MessageReaction, ReactionCollector, User} from "discord.js";
import * as TTRMatch from "../structures/TTRMatch";
import {Profile} from "../structures/TTRProfile";

export default <Command>{
    name: "lobby",
    description: "Gets information about a TTR lobby",
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

        if (!args[1])
            throw new Error("No lobby ID provided.");
        const targetMatch: TTRMatch.Match | undefined = await base.sqlite.get("SELECT * FROM ttrMatches WHERE id = ?", args[1]);
        if (!targetMatch) throw new Error("Match with given ID does not exist.");
        const players: Profile[] = await base.sqlite.all("SELECT user, rating FROM ttrProfiles ORDER BY rating DESC LIMIT 20 WHERE currentLobby = ?", args[1]);
        return [{
            embed: {
                title: "TTR Match Overview (Lobby: " + targetMatch.id + ")",
                description: "**" + TTRMatch.stateToString(targetMatch.state) + "**\n" + players.map(v => `<@${v.user}> (Rating: ${v.rating})`).join("\n")
            }
        }];
    }
}