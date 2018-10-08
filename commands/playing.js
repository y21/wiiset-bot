module.exports = class PlayingCommand {
	static run(message) {
        message.reply((message.translations.commands.playing || "Translation error").replace(/\{amount\}/g, message.client.users.filter(u => (u.presence.game || { name: 0 }).name === message.args.join(" ")).size).replace(/\{game\}/g, message.args.join(" ").replace(/`/g, "")));
	}
};