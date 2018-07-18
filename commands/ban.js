module.exports = async message => {
	try {
		if(!message.guild) return message.reply("this command is only available in servers");
		if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("you do not have enough permissions to ban members. (`BAN_MEMBERS`)");
		
		let target;
		
		if(message.mentions.members.size === 0){
			target = message.guild.member(message.client.users.find(val => val.id === message.args[0] || val.tag === message.args[0]));
		} else target = message.mentions.members.first();
		
		if(!target) return message.reply("No member to ban.");
		
		message.reply(`Do you really want to ban __${target.user.tag}__? Reply with either __y__es or __n__o within the next 25 seconds.`, {
			disableEveryone: true
		});
		
		const collector = message.channel.createMessageCollector(m => {
			return m.author.id === message.author.id && (m.content === "y" || m.content === "yes" || m.content === "n" || m.content === "no");
		}, {
			time: 25000,
			max: 1
		});
		
		collector.on("collect", m => {
			if(m.content === "y" || m.content === "yes"){
				message.reply("banned.");
			} else {
				message.reply("ban aborted.");
			}
		});
		
		collector.on("end", () => {
			message.reply("ban aborted.");
		});
		
		
	} catch(err) {
		console.log(err);
	}
};