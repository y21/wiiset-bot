module.exports = class KickCommand {
	static run(message) {
        try {
            if(!message.guild) return message.reply(message.translations.commands.guild_only || "Translation error");
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply((message.translations.commands.no_permissions || "Translation error").replace(/\{perm\}/g, "KICK_MEMBERS"));

            let target;

            if(message.mentions.members.size === 0){
                target = message.guild.member(message.client.users.find(val => val.id === message.args[1] || val.tag === message.args[1]));
            } else target = message.mentions.members.first();
            if(!target) return message.reply(message.translations.commands.no_member_softban || "Translation error");

            message.reply((message.translations.commands.kick_confirmation || "Translation error").replace(/\{target\}/g, target.user.tag).replace(/\{reason\}/, (message.args.slice(2).join(" ") || "- none -")));

            const collector = message.channel.createMessageCollector(m => {
                return m.author.id === message.author.id && (m.content === "y" || m.content === "yes" || m.content === "n" || m.content === "no");
            }, {
                time: 25000,
                max: 2
            });

            collector.on("collect", m => {
                if(m.content === "y" || m.content === "yes"){
                    target.kick({ days: 7, reason: "Kick requested by " + message.author.tag + " | Reason: " + (message.args.slice(2).join(" ") || "- none -")}).then(() => {
                        message.channel.send((message.translations.commands.kicked || "Translation error").replace(/\{target\}/g, target.user.tag));
                    }).catch(err => {
                        message.reply((message.translations.commands.kick_error || "Translation error") + " `" + err.toString() + "`");
                    });
                } else {
                    message.reply(message.translations.commands.kick_aborted || "Translation error");
                }
            });
        } catch(err) {
            console.log(err);
        }
	}
};