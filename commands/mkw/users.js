const { get } = require("snekfetch");
const { RichEmbed } = require("discord.js");

module.exports = async message => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    let request = await get("http://wiimmfi.glitch.me/users"),
        counts = [ 0, 10, 1 ],
        embed = new RichEmbed()
        .setTitle("Online users - page 1")
        .setDescription("```https\n" + request.body.slice(counts[0], counts[1]).join("\n") + "\n```")
        .setFooter("Total players: " + request.body.length);
        let m = await message.channel.send(embed);
        m.react("⬅").then(m => {
            m.message.react("➡").catch();
        }).catch();
        request.body = request.body.sort((a,b)=>alphabet.indexOf(a.charAt(0))-alphabet.indexOf(b.charAt(0)));
};
