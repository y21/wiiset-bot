const { readdirSync } = require("fs");
let langs = readdirSync("./lang/");
langs = langs.map(lang => lang.substr(0, lang.indexOf(".json")));

module.exports = class LangCommand {
	static run(message) {
        if(!message.guild) return message.reply("This command is only available in guilds.");
        if(!message.member.hasPermission("MANAGE_SERVER")) return message.reply("you dont have enough permissions.");
        return message.connection.prepare("SELECT * FROM languages WHERE guild = ?").then(prepared => {
            prepared.get([ message.guild.id ]).then(res => {
                if(typeof res !== "undefined" && message.args.length === 1) return message.reply("Local language is set to `" + res.lang + "`");
                if(!langs.some(lang => lang.toLowerCase() === message.args[1].toLowerCase())) return message.reply("Language not found. Make sure to set it to one of them: " + langs.join(", "));
                if(res) {
                    message.connection.prepare("UPDATE languages SET lang = ? WHERE guild = ?").then(prepared2 => {
                        prepared2.run([message.args[1].toLowerCase(), message.guild.id]).then(() => {
                            message.reply(`Local language set to ${message.args[1].toLowerCase()}`);
                        }).catch(() => {
                            message.reply("An internal error occured while trying to set the language.");
                        });
                    });
                } else {
                    message.connection.prepare("INSERT INTO languages (guild, lang) VALUES (?, ?)").then(prepared2 => {
                        prepared2.run([message.guild.id, message.args[1].toLowerCase()]).then(() => {
                            message.reply(`Local language set to ${message.args[1].toLowerCase()}`);
                        }).catch(() => {
                            message.reply("An internal error occured while trying to set the language.");
                        });
                    });
                }
            }).catch(error => {
                message.reply("An error occured: " + error.toString());
            });
        });
	}
};
