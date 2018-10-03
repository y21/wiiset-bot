const { getByTag } = require("../utils/UserResolver");

module.exports = message => {
    let target;
    if (message.args.length === 0) return message.reply("who to lick?!");
    if (message.mentions.users.size > 0) target = message.mentions.users.first();
    else if (/^.+#\d{4}$/.test(message.args[0])) target = getByTag(message.client.users, message.args[0]);
    if (target === undefined) return message.reply("who to lick?!");
    message.connection.get("SELECT * FROM licks WHERE id='" + target.id + "'").then(r => {
        let licks = 1;
        if (!r) message.connection.run("INSERT INTO licks VALUES ('" + target.id + "', 1)");
        else {
            message.connection.run(`UPDATE licks SET amount=${r.amount + 1} WHERE id='${target.id}'`);
            licks = r.amount + 1;
        }
        message.channel.send({
            embed: {
                color: 0x77b254,
                author: {
                    name: target.tag,
                    icon_url: target.displayAvatarURL
                },
                fields: [{
                        name: "Lick User",
                        value: message.translations.commands.lick_user || "Translation error",
                    },
                    {
                        name: "Total licks",
                        value: (message.translations.commands.total_licks || "Translation error").replace(/\{amount\}/g, licks).replace(/\{user\}/g, target.username)
                    },
                ],
                footer: {
                    text: `Licked by ${message.author.tag}`,
                    icon_url: message.author.displayAvatarURL
                }
            }
        });
    }).catch(err => {
        message.connection.run("CREATE TABLE IF NOT EXISTS `licks` (`id` TEXT, `amount` INTEGER);");
    });
};
