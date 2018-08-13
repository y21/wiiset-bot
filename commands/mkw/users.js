const { get } = require("snekfetch");
const { RichEmbed } = require("discord.js");

module.exports = async message => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    let request = await get("http://wiimmfi.glitch.me/users"),
        counts = [ 0, 10, 1 ],
        embed = new RichEmbed()
        .setTitle((message.translations.commands.mkw_online_users || "Translation error").replace(/\{page\}/g, 1))
        .setDescription("```https\n" + request.body.slice(counts[0], counts[1]).join("\n") + "\n```")
        .setFooter((message.translations.commands.mkw_total_players || "Translation error").replace(/\{players\}/g, request.body.length));
        let m = await message.channel.send(embed);
        m.react("⬅").then(m => {
            m.message.react("➡").catch();
        }).catch();
        request.body = request.body.sort((a,b)=>alphabet.indexOf(a.charAt(0))-alphabet.indexOf(b.charAt(0)));
        const collector = m.createReactionCollector((reaction, user) => user.id === message.author.id && (reaction.emoji.name === "➡" || reaction.emoji.name === "⬅"), { time: 60000 })
        collector.on("collect", reaction => {
            if(reaction.emoji.name === "➡"){
                if(counts[2] > request.body.length) return;
                counts[0] += 10;
                counts[1] += 10;
                counts[2]++;
            } else {
                if(counts[1] < 10) return;
                counts[0] -= 10;
                counts[1] -= 10;
                counts[2]--;
            }

            embed.title = `Online users - page ${counts[2]}`;
            embed.description = "```https\n" + request.body.slice(counts[0], counts[1]).join("\n") + "\n```";
            m.edit(embed);
            reaction.remove(message.author);
        });
};
