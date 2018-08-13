module.exports = message => {
	const { connection } = message;
	let limit, timestamp = Date.now();
	if(!isNaN(message.args[1]) && message.args[1] < 10) limit = parseInt(message.args[1]);
	else limit = 10;
	connection.all(`SELECT * FROM tags ORDER BY uses DESC LIMIT ${limit}`).then(res => {
		message.channel.send({ embed: {
			title: "Tag list",
			description: (message.translations.commands.tag_list_heading || "Translation error").replace(/\{amount\}/g, limit).replace(/\{time\}/g, Date.now() - timestamp).replace(/\{prefix\}/g, message.prefix),
			fields: res.map(element => {
				return {
					name: element.name,
					value: (message.translations.commands.tag_list_value || "Translation error").replace(/\{amount\}/g, element.uses).replace(/\{date\}/g, new Date(parseInt(element.createdAt)).toLocaleString())
				};
			})
		}});
	}).catch(console.log);
}
