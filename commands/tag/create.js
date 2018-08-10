module.exports = message => {
	if(message.args.length < 3) return message.reply(`Not enough parameters. Syntax: ${message.prefix}tag create <tag-name> <tag-content>`);
	if(message.args[1].length > 30) return message.reply("Tag name must not reach 30 characters.");
	if(!/[\w\-]{3,16}/.test(message.args[1])) return message.reply("Tag name is invalid. Make sure it matches with this regular expression: ```js\n[\\w\\-]{3,16}\n```");
	const { connection } = message;
	connection.prepare("SELECT * FROM tags WHERE name=?").then(prepared => {
		prepared.get([ message.args[1] ]).then(res => {
			if(res) {
				message.reply("A tag with that name already exists.");
			} else {
				connection.prepare("INSERT INTO tags VALUES (?, ?, ?, ?, ?)").then(prepared2 => {
					prepared2.run([ message.args[1], message.author.id, message.args.slice(2).join(" "), Date.now(), 0 ]).then(() => {
						message.reply(`Your tag has been created. You can access it by typing ${message.prefix}tag ${message.args[1]}`, {
							disableEveryone: true
						});
					});
				});
			}
		});
	});
}
