const { RichEmbed } = require("discord.js");
const { getByTag } = require("../utils/UserResolver");

module.exports = message => {
	let target;
    if (message.args.length === 0) return message.reply("who to lick?!");
	if (message.mentions.users.size > 0) target = message.mentions.users.first();
	else if (/^.+#\d{4}$/.test(message.args[0])) target = getByTag(message.client.users, message.args[0]);
	if (target === undefined) return message.reply("who to lick?!");
    message.connection.get("SELECT * FROM licks WHERE id='" + target.id + "'").then(r => {
        let licks = 1;
        if(!r) message.connection.run("INSERT INTO licks VALUES ('" + target.id + "', 1)");
        else {
            message.connection.run(`UPDATE licks SET amount=${r.amount + 1} WHERE id='${target.id}'`);
            licks = r.amount + 1;
        }
        message.channel.send(
            new RichEmbed()
                .setAuthor(target.tag, target.avatarURL, target.avatarURL)
                .setColor(0x77b254)
                .addField("Lick User", message.translations.commands.lick_user || "Translation error")
                .addField("Total licks", (message.translations.commands.total_licks || "Translation error").replace(/\{amount\}/g, licks).replace(/\{user\}/g, target.username))
                .setFooter(`Licked by ${message.author.tag}`, message.author.avatarURL)
        );
    }).catch(err => {
        if(err.toString().includes("no such table: licks")) message.connection.run("CREATE TABLE `licks` (`id` TEXT, `amount` INTEGER);");
    });
};
