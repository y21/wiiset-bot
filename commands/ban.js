module.exports = async message => {
	try {
		if(!message.guild) return message.reply("this command is only available in servers");
		if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("you do not have enough permissions to ban members. (`BAN_MEMBERS`)");
		
		let target;
		
		if(message.mentions.members.size === 0){
			target = message.guild.member(message.client.users.find(val => val.id === message.args[0] || val.tag === message.args[0]));
		} else target = message.mentions.members.first();
		if(!target) return message.reply("No member to ban. You either did not provide any GuildMember (User ID, User Tag (User#1234) or mention");
		
		message.reply(`Do you really want to ban __${target.user.tag}__? Reply with either __y__es or __n__o within the next 25 seconds.`, {
			disableEveryone: true
		});
		
		const collector = message.channel.createMessageCollector(m => {
			return m.author.id === message.author.id && (m.content === "y" || m.content === "yes" || m.content === "n" || m.content === "no");
		}, {
			time: 25000,
			max: 2
		});
		
		collector.on("collect", m => {
			if(m.content === "y" || m.content === "yes"){
				target.ban({ days: 7, reason: "Ban requested by " + message.author.tag }).then(() => {
					message.channel.send(`__${target.user.tag}__ has been banned.`);
				}).catch(() => {
					message.reply("could not ban the targeted user.");
				});
			} else {
				message.reply("Ban aborted.");
			}
		});
	} catch(err) {
		console.log(err);
	}
};