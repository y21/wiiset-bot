import Command from "../structures/Command";
import Base from "../Base";
import {Message} from "discord.js";
import fetch from "node-fetch";

interface SSBBEndpointResponse {
    totalProfiles?: number,
    online?: number,
    logins: {
        thirty_minutes?: number,
        four_hours?: number,
        twentyfour_hours?: number
    },
    lastCheck: string,
    status: number
}

export default <Command>{
    name: "ssbb",
    description: "Information about online statistics for Super Smash Bros. Brawl",
    args: [],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: (base: Base, message: Message) => {
        return new Promise((a: any, b: any) => {
            fetch("https://wiimmfi.glitch.me/ssbb/amount").then((res: any) => res.json())
                .then((res: SSBBEndpointResponse) => {
                    a([{
                        embed: {
                            title: "Super Smash Bros. Brawl information",
                            color: res.online === 0 ? 0xFF0000 : 0x00FF00,
                            fields: [
                                {
                                    name: "Total profiles",
                                    value: res.totalProfiles || 0
                                },
                                {
                                    name: "Currently online",
                                    value: res.online || 0
                                },
                                {
                                    name: "Logins in the past 30 minutes",
                                    value: res.logins.thirty_minutes || 0
                                },
                                {
                                    name: "Logins in the past 4 hours",
                                    value: res.logins.four_hours || 0
                                },
                                {
                                    name: "Logins in the past 24 hours",
                                    value: res.logins.twentyfour_hours || 0
                                }
                            ]
                        }
                    }])
                });
        });
    }
}