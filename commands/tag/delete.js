module.exports = message => {
	if(message.args.length < 2) return message.reply(`Not enough parameters. Syntax: ${message.prefix}tag delete <tag-name>`); 
	const { connection } = message;
	connection.prepare("DELETE FROM tags WHERE name=? AND author=?").then(prepared => {
		prepared.run([message.args[1], message.author.id]).then(res => {
			if(res.changes === 0) {
				message.reply("The tag was not found or you don't own that tag.");
			} else {
				message.reply("Tag has been deleted.");
			}
		});
	}).catch(console.log);
}
