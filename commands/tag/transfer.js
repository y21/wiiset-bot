module.exports = async message => {
	// Command deactivated for now
	// People could create disturbing tags
	// And transfer them to others 
	// So that it looks like they created it.
	return message.reply("This command is not available for now.");
	if(message.args.length < 3) return message.reply(`Not enough parameters. Syntax: ${message.prefix}tag transfer <tag-name> <new-owner>`);
	let target;
	try {
		target = await message.client.fetchUser(message.args[2]);
	} catch(error) {
		return message.reply("User not found. Make sure to provide a **User ID**.");
	}
	if(!target) return message.reply("User not found. Make sure to provide a **User ID**!");
	const { connection } = message;
	connection.prepare("UPDATE tags SET author=? WHERE author=? AND name=?").then(prepared => {
		prepared.run([ message.args[2], message.author.id, message.args[1] ]).then(res => {
			if(res.changes === 0) {
				message.reply("Tag could not be transfered.");
			} else {
				message.channel.send(target.toString(), { embed: {
					title: "Tag transfer",
					description: `__${message.author.tag}__ wants to transfer the tag *${message.args[1]}* to you. \nWrite **y**es to accept it or **n**o to decline it.`
				}});
				
			}
		});
	});
}
