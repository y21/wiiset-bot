module.exports = async message => {
	if(!message.guild) return message.reply(message.translations.commands.guild_only || "Translation error");
	if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply((message.translations.commands.no_permissions || "Translation error").replace(/\{perm\}/g, "BAN_MEMBERS"));
		
	let target;
		
	if(message.mentions.members.size === 0){
		target = message.guild.member(message.client.users.find(val => val.id === message.args[1] || val.tag === message.args[1]));
	} else target = message.mentions.members.first();
	if(!target) return message.reply(message.translations.commands.no_member_softban || "Translation error");
	
	let prepareMessage = await message.reply(`softbanning __${target.user.tag}__...`);
	target.ban({ days: 7 }).then(() => {
		prepareMessage.edit((message.translations.commands.softbanned || "Translation error").replace(/\{target\}/g, target.user.tag));
	}).catch(e => {
		prepareMessage.edit(message.translations.commands.softban_error || "Translation error");
	});
	message.guild.unban(target.user.id).then(() => {
		prepareMessage.edit((message.translations.commands.unbanned || "Translation error").replace(/\{target\}/g, target.user.tag));
	}).catch(() => {
		prepareMessage.edit(message.translations.commands.unban_error || "Translation error");
	});
	
	
};
