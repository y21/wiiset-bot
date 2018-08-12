// Not finished yet.

const { readdirSync } = require("fs");
let langs = readdirSync("./lang/");
langs = langs.map(lang => lang.substr(0, lang.indexOf(".json")));

module.exports = message => {
	if(!message.guild) return message.reply("This command is only available in guilds.");
	if(message.guild.owner.user.id !== message.author.id) return message.reply("only the guild owner can set the guild language.");
	return message.connection.prepare("SELECT * FROM languages WHERE guild = ?").then(prepared => {
		prepared.get([ message.guild.id ]).then(res => {
			if(typeof res !== "undefined" && message.args.length === 0) return message.reply("Local language is set to `" + res.lang + "`");
			if(!flags.includes(message.args[0])) return message.reply("Language not found. Make sure to set it to one of them: " + flags.join(", "));
			if(res) {
				message.connection.prepare("UPDATE languages SET lang = ? WHERE guild = ?").then(prepared2 => {
					prepared2.run([message.args[0], message.guild.id]).then(() => {
						message.reply(`Local language set to ${message.args[0]}`);
					});
				});
			} 
		});
	});
}
