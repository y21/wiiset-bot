import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";
import {Collection, Message, MessageReaction, ReactionCollector} from "discord.js";
import * as FlagHandler from "../structures/FlagHandler";

function formatDate(b: number) {
    return Math.floor(b / (60000 * 60)) + " hours, " + Math.floor(b / (60000) - 60 * Math.floor(b / (60000 * 60))) + " minutes and " + Math.floor(b / (1000) - 60 * Math.floor(b / (60000))) + " seconds ago";
}

interface Player {
    fc: string;
    ev: number;
    eb: number;
    names: string[];
    ol_role: string;
    region: string;
    rk: string;
}

interface Room {
    type: string;
    room_id: number;
    room_name: string;
    game_id4: string;
    room_start: number;
    race_start: number;
    n_races: number;
    members: Player[];
}

export default <Command>{
    name: "room",
    description: "Shows information about a specific room",
    args: [{
        name: "room",
        description: "The room to search for. This can be either the room ID or the room name. Alternatively you can use the `name` option to search by Mii name.",
        required: false
    }],
    guildOnly: false,
    category: "mkw",
    ownerOnly: false,
    run: (base: Base, message: Message) => {
        const args: string[] = message.content.split(" ").slice(1);
        return new Promise(async (a: any, b: any) => {
            fetch("https://wiimmfi.de/mkw?m=json").then((res: any) => res.json())
                .then(async (res: any) => {
                    const flags: FlagHandler.Flag[] = FlagHandler.default.from(message.content);
                    const playerFlagValue: FlagHandler.Flag | undefined = flags.find(v => v.full === "user" || v.pre === "u");
                    const roomID = !playerFlagValue ? parseInt(args[1]) : undefined;
                    let page = 0;
                    let target: Room | undefined = res.filter((v: any) => v.type === "room").find((v: any) => playerFlagValue ? v.members.some((v: any) => v.names.includes(playerFlagValue.value)) : (roomID && v.room_id === roomID) || v.room_name === args[1]);
                    if (typeof target === "undefined") return b("Room not found");


                    const roomStatsEmbed: any = {
                        embed: {
                            title: `Room statistics (Room: ${target.room_name} | ID: ${target.room_id})`,
                            color: 0x3498db,
                            description: `This room was created ${formatDate(Date.now() - target.room_start * 1000)}. The last race started ${formatDate(Date.now() - target.race_start * 1000)}`,
                            fields: [{
                                name: "Average VR",
                                value: Math.floor((target.members.filter(v => v.ev !== -1).map(e => e.ev).length === 0 ? [0] : target.members.filter(v => v.ev !== -1).map(e => e.ev)).reduce((a, b) => a + b) / target.members.filter(v => v.ev !== -1).length) || "-"
                            },
                                {
                                    name: "Highest VR",
                                    value: target.members.sort((a, b) => b.ev - a.ev)[0].ev == -1 ? "-" : target.members.sort((a, b) => b.ev - a.ev)[0].ev
                                },
                                {
                                    name: "Lowest VR",
                                    value: target.members.sort((a, b) => a.ev - b.ev)[0].ev == -1 ? "-" : target.members.sort((a, b) => a.ev - b.ev)[0].ev
                                }
                            ],
                            footer: {
                                text: "Next page: Players in this room"
                            }
                        }
                    };
                    const msg: Message | Message[] = await message.channel.send(roomStatsEmbed);
                    if (Array.isArray(msg)) return b("Internal error occurred: sending the message returned an array of messages.");
                    await msg.react("⬅");
                    await msg.react("➡");
                    await msg.react("🔍");

                    const collector: ReactionCollector = msg.createReactionCollector((reaction, user) => user.id === message.author.id && (reaction.emoji.name === "➡" || reaction.emoji.name === "⬅" || reaction.emoji.name === "🔍"), {
                        time: 24e4
                    });

                    collector.on("collect", async (reaction: MessageReaction) => {
                        if (reaction.emoji.name === "🔍") {
                            await message.reply("What player do you want to search for?");
                            return message.channel.awaitMessages((m: Message) => m.author.id === message.author.id, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            })
                                .then(async (r: Collection<string, Message>) => {
                                    if (!target) return;
                                    const member: Player | undefined = target.members.find(v => v.names[0] === r.first().content);
                                    if (!member) return;
                                    await msg.edit({
                                        embed: {
                                            title: `Statistics about player ${member.names[0]} (Room: ${target.room_name} | ID: ${target.room_id})`,
                                            color: 0x3498db,
                                            description: "Host: " + (member.ol_role === "host" ? "yes" : "no"),
                                            fields: [{
                                                name: "Versus Rating (VR)",
                                                value: member.ev
                                            },
                                                {
                                                    name: "Battle Rating (BR)",
                                                    value: member.eb
                                                },
                                                {
                                                    name: "Friend code",
                                                    value: member.fc
                                                },
                                                {
                                                    name: "Room type",
                                                    value: member.rk
                                                },
                                                {
                                                    name: "Login region",
                                                    value: member.region
                                                }
                                            ],
                                            footer: {
                                                text: `Player ${page}/${target.members.length}`
                                            }
                                        }
                                    }).catch(console.error);
                                }).catch();
                        }
                        if (reaction.emoji.name === "⬅" && page > 0) { // one page backwards
                            --page;
                        } else if (target && page <= target.members.length) {
                            ++page;
                        }

                        if (page === 0) await msg.edit(roomStatsEmbed);
                        else if (page && target) {
                            const member = target.members[page];
                            await msg.edit({
                                embed: {
                                    title: `Statistics about player ${member.names[0]} (Room: ${target.room_name} | ID: ${target.room_id})`,
                                    color: 0x3498db,
                                    description: "Host: " + (member.ol_role === "host" ? "yes" : "no"),
                                    fields: [{
                                        name: "Versus Rating (VR)",
                                        value: member.ev
                                    },
                                        {
                                            name: "Battle Rating (BR)",
                                            value: member.eb
                                        },
                                        {
                                            name: "Friend code",
                                            value: member.fc
                                        },
                                        {
                                            name: "Room type",
                                            value: member.rk
                                        },
                                        {
                                            name: "Login region",
                                            value: member.region
                                        }
                                    ],
                                    footer: {
                                        text: `Player ${page}/${target.members.length}`
                                    }
                                }
                            }).catch(console.error);
                            reaction.remove(message.author).catch();
                        }
                    });



                }).catch(b);
        });
    }
}