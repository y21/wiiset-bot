const { RichEmbed } = require("discord.js");
module.exports = message => {
    if(message.mentions.users.size == 0) return message.reply("who to lick?!");
    message.connection.get("SELECT * FROM licks WHERE id='" + message.mentions.users.first().id + "'").then(r => {
        let licks = 1;
        if(!r) message.connection.run("INSERT INTO licks VALUES ('" + message.mentions.users.first().id + "', 1)");
        else {
            message.connection.run(`UPDATE licks SET amount=${r.amount + 1} WHERE id='${message.mentions.users.first().id}'`);
            licks = r.amount + 1;
        }
        message.channel.send(
            new RichEmbed()
                .setAuthor(message.mentions.users.first().tag, message.mentions.users.first().avatarURL, message.mentions.users.first().avatarURL)
                .setColor(0x77b254)
                .addField("Lick User", ":white_check_mark: Paws successfully licked.")
                .addField("Total licks", `**${message.mentions.users.first().username}**'s paws got licked ${licks} times.`)
                .setFooter(`Licked by ${message.author.tag}`, message.author.avatarURL)
        );
    }).catch(err => {
        if(err.toString().includes("no such table: licks")) message.connection.run("CREATE TABLE `licks` (`id` TEXT, `amount` INTEGER);");
    });
};
