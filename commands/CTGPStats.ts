import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";

export default <Command>{
    name: "stats",
    description: "Sends information about the ghost database such as total ghosts, registered consoles...",
    args: [],
    guildOnly: false,
    category: "ctgp",
    ownerOnly: false,
    run: (base: Base, message: any) => {
        return new Promise((a: any, b: any) => {
            fetch("http://tt.chadsoft.co.uk/index.json").then((res: any) => res.text())
                .then((res: any) => {
                    res = JSON.parse(res.replace(/^\s+/, ""));
                    a([{
                        embed: {
                            title: "Ghost database statistics",
                            color: (message.member || { displayColor: 0x00FF00 }).displayColor,
                            fields: [
                                {
                                    name: "Registered consoles",
                                    value: (res.uniquePlayers || 0).toLocaleString()
                                },
                                {
                                    name: "Total leaderboards",
                                    value: (res.leaderboardCount || 0).toLocaleString()
                                },
                                {
                                    name: "Total ghosts",
                                    value: (res.ghostCount || 0).toLocaleString()
                                }
                            ]
                        }
                    }])
                });
        });
    }
}