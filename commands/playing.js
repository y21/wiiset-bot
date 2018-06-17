module.exports = message => {
	message.reply("`" + message.client.users.filter(u => (u.presence.game || { name: 0 }).name === message.args.join(" ")).size + "` people are playing `" + message.args.join(" ").replace(/`/g, "") + "`", {
		disableEveryone: true
	});
}
