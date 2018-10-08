module.exports = class ViewCommand {
    static run(message) {
        if (message.args.length != 2) return message.reply("Please specify a tag by its name.");
        const { readdirSync } = require("fs");
        const { connection } = message;
        connection.prepare("SELECT * FROM tags WHERE name=?").then(prepared => {
            prepared.get([message.args[1]]).then(res => {
                if (!res) return message.reply("Tag was not found");
                connection.prepare("UPDATE tags SET uses=? WHERE name=?").then(prepared2 => {
                    prepared2.run([res.uses + 1, message.args[1]]);
                });
                message.channel.send(res.content.substr(0, 1900) + (message.translations.commands.tag_footer || "Translation error").replace(/\{owner\}/g, res.author), {
                    disableEveryone: true
                });
            });
        }).catch(console.log);
    }
};