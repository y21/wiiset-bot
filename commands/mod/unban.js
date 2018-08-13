module.exports = message => {
	if(!message.guild) return message.reply(message.translations.commands.guild_only || "Translation error");
	if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply((message.translations.commands.no_permission || "Translation error").replace(/\{perm\}/g, "BAN_MEMBERS"));
	
	if(message.args.length === 0) return message.reply(message.translations.commands.no_member_unban);
	
	message.guild.unban(message.args[1]).then(u => {
		message.reply((message.translations.commands.unbanned || "Translation error").replace(/\{target\}/g, u.tag)).catch(console.log);
	}).catch(e => {
		message.reply(message.translations.commands.unban_error + "Error: `" + e.toString() + "`").catch(console.log);
	});
};
