import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";

export default <Command>{
    name: "list",
    description: "Shows Mario Kart Wii room statistics",
    args: [],
    guildOnly: false,
    category: "mkw",
    ownerOnly: false,
    run: (base: Base, message: any) => {
        return new Promise(async (a: any, b: any) => {
            fetch(`${Base.wiimmfiAPI}/mkw/amount`).then((res: any) => res.json())
                .then((res: any) => {
                    a([{
                        embed: {
                            title: "Mario Kart Wii Room Overview",
                            thumbnail: {
                                url: "http://chadsoft.co.uk/wiimmfi/wiimmfi-dark.png"
                            },
                            color: 0x00FF00,
                            fields: [
                                {
                                    name: "Worldwide rooms",
                                    value: res.available.worldwides || "?"
                                },
                                {
                                    name: "Continental rooms",
                                    value: res.available.continentals || "?"
                                },
                                {
                                    name: "Private rooms",
                                    value: res.available.privates || "?"
                                },
                                {
                                    name: "Total players",
                                    value: res.available.players || "?"
                                }
                            ],
                            footer: {
                                text: "Data will be fetched and refreshed every 5 minutes.",
                                icon_url: message.author.displayAvatarURL
                            }
                        }
                    }]);
                }).catch(b);
        });
    }
}