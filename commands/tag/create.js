module.exports = message => {
	if(message.args.length < 3) return message.reply((message.translations.commands.tag_nparams_create || "Translation error").replace(/\{prefix\}/g, message.prefix));
	if(message.args[1].length > 30) return message.reply(message.translations.commands.tag_too_long || "Translation error");
	if(!/[\w\-]{3,16}/.test(message.args[1])) return message.reply(message.translations.commands.tag_regex_not_match || "Translation error");
	const { connection } = message;
	connection.prepare("SELECT * FROM tags WHERE name=?").then(prepared => {
		prepared.get([ message.args[1] ]).then(res => {
			if(res) {
				message.reply(message.translations.commands.tag_already_exists || "Translation error");
			} else {
				connection.prepare("INSERT INTO tags VALUES (?, ?, ?, ?, ?)").then(prepared2 => {
					prepared2.run([ message.args[1], message.author.id, message.args.slice(2).join(" "), Date.now(), 0 ]).then(() => {
						message.reply((message.translations.commands.tag_created || "Translation error").replace(/\{prefix\}/g, message.prefix).replace(/\{name\}/g, message.args[1]), {
							disableEveryone: true
						});
					});
				});
			}
		});
	});
}
