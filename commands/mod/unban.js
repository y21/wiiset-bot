module.exports = message => {
	if(!message.guild) return message.reply("this command is only available in servers");
	if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("you do not have enough permissions to ban members. (`BAN_MEMBERS`)");
	
	if(message.args.length === 0) return message.reply("No member to unban. You either did not provide any GuildMember (User ID, User Tag (User#1234) or mention");
	
	message.guild.unban(message.args[0]).then(u => {
		message.reply(`__${u.tag}__ has been unbanned.`).catch(console.log);
	}).catch(e => {
		message.reply(`an error occured while trying to unban a GuildMember. \`${e.toString()}\``).catch(console.log);
	});
};