module.exports = message => {
	const { connection } = message;
	let limit, timestamp = Date.now();
	if(!isNaN(message.args[1]) && message.args[1] < 10) limit = parseInt(message.args[1]);
	else limit = 10;
	connection.all(`SELECT * FROM tags ORDER BY uses DESC LIMIT ${limit}`).then(res => {
		message.channel.send({ embed: {
			title: "Tag list",
			description: `A list of ${limit} tags has been loaded in ${Date.now() - timestamp} milliseconds. To view a tag, type \`${message.prefix}tag <tagname>\``,
			fields: res.map(element => {
				return {
					name: element.name,
					value: `Uses: ${element.uses} | Created at ${new Date(parseInt(element.createdAt)).toLocaleString()}`
				};
			})
		}});
	}).catch(console.log);
}
