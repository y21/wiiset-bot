const fetch = require("node-fetch");

const formatDate = b => {
    return Math.floor(b / (60000 * 60)) + " hours, " + Math.floor(b / (60000) - 60 * Math.floor(b / (60000 * 60))) + " minutes and " + Math.floor(b / (1000) - 60 * Math.floor(b / (60000))) + " seconds ago";
};

module.exports = async message => {
    if (message.args.length === 1) return message.reply("Missing arguments.");
    let request = await fetch("https://wiimmfi.de/mkw/lis?m=json");
    let page = 0;
    let json = await request.json();
	let target;
	if (message.flags.find(v => /^user=.+$/.test(v))) {
		target = json.find(v => v.members.some(vv => vv.names[0] === /^user=(.+)$/.exec(message.flags.find(vvv => vvv.startsWith("user=")))[1]));
	} else target = json.filter(v => v.type === "room").find(v => v.room_id === message.args[1] || v.room_name === message.args[1]);
    if (typeof target === "undefined") return message.reply("room not found.");
    const roomStatsEmbed = {
        embed: {
            title: `Room statistics (Room: ${target.room_name} | ID: ${target.room_id})`,
            color: 0x3498db,
            description: `This room was created ${formatDate(Date.now() - target.room_start * 1000)}. The last race started ${formatDate(Date.now() - target.race_start * 1000)}`,
            fields: [{
                    name: "Average VR",
                    value: Math.floor((target.members.filter(v => v.ev !== -1 && typeof v.ev === "number").map(e => e.ev).length === 0 ? [0] : target.members.filter(v => v.ev !== -1 && typeof v.ev === "number").map(e => e.ev)).reduce((a, b) => a + b) / target.members.filter(v => v.ev !== -1 && typeof v.ev === "number").length) || "-"
                },
                {
                    name: "Highest VR",
                    value: target.members.sort((a, b) => a.ev < b.ev)[0].ev || "-"
                },
                {
                    name: "Lowest VR",
                    value: target.members.sort((a, b) => a.ev > b.ev)[0].ev || "-"
                }
            ],
            footer: {
                text: "Next page: Players in this room"
            }
        }
    };
    const msg = await message.channel.send(roomStatsEmbed).catch();
    await msg.react("⬅");
    await msg.react("➡");
    await msg.react("🔍");

    const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id && (reaction.emoji.name === "➡" || reaction.emoji.name === "⬅" || reaction.emoji.name === "🔍"), {
        time: 24e4
    });


    collector.on("collect", async reaction => {
        if (reaction.emoji.name === "🔍") {
            await message.reply("What player do you want to search for?");
            return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time']
                })
                .then(async r => {
                    const member = target.members.find(v => v.names[0] === r.first().content);
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
        } else if (page <= target.members.length) {
            ++page;
        }

        if (page === 0) await msg.edit(roomStatsEmbed);
        else if (page) {
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

    collector.on("end", collector.stop);

};
