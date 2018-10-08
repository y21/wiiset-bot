module.exports = class TransferCommand {
	static async run(message) {
        // Command deactivated for now
        // People could create disturbing tags
        // And transfer them to others
        // So that it looks like they created it.
        return message.reply(message.translations.commands.unavailable_command || "Translation error");
        if(message.args.length < 3) return message.reply((message.translations.commands.tag_nparams_transfer || "Translation error").replace(/\{prefix\}/g, message.prefix));
        let target;
        try {
            target = await message.client.fetchUser(message.args[2]);
        } catch(error) {
            return message.reply(message.translations.commands.tag_user_not_found || "Translation error");
        }
        if(!target) return message.reply(message.translations.commands.tag_user_not_found || "Translation error");
        const { connection } = message;
        connection.prepare("UPDATE tags SET author=? WHERE author=? AND name=?").then(prepared => {
            prepared.run([ message.args[2], message.author.id, message.args[1] ]).then(res => {
                if(res.changes === 0) {
                    message.reply(message.translations.commands.tag_transfer_error || "Translation error");
                } else {
                    message.channel.send(target.toString(), { embed: {
                            title: "Tag transfer",
                            description: (message.translations.commands.tag_transfer_request || "Translation error").replace(/\{owner\}/g, message.author.tag).replace(/\{tagname\}/g, message.args[1])
                        }});
                }
            });
        });
	}
};