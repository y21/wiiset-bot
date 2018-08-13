module.exports = message => {
	if(message.args.length < 2) return message.reply((message.translations.commands.tag_nparams_delete || "Translation error").replace(/\{prefix\}/g, message.prefix)); 
	const { connection } = message;
	connection.prepare("DELETE FROM tags WHERE name=? AND author=?").then(prepared => {
		prepared.run([message.args[1], message.author.id]).then(res => {
			if(res.changes === 0) {
				message.reply(message.translations.commands.tag_not_deleted || "Translation error");
			} else {
				message.reply(message.translations.commands.tag_deleted || "Translation error");
			}
		});
	}).catch(console.log);
}
