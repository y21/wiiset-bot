module.exports = message => {
    if (message.args.length === 1) return message.reply("No profile ID provided. Usage: `" + message.prefix + "ctgp setpid profile_id_here`");
    if (!/[A-Z0-9]+/.test(message.args[1])) return message.reply("Invalid player ID format.");
    const { connection } = message;
    connection.get("SELECT * FROM pids WHERE user='" + message.author.id + "'").then(res => {
        if (typeof res === "undefined") {
            connection.prepare("INSERT INTO pids VALUES (?, ?)").then(prepared => {
                prepared.run([ message.author.id, message.args[1] ]).then(() => {
                    message.reply("Profile ID successfully set. You can now use `w.ctgp user` with a mention instead of providing the profile ID.", {
                        disableEveryone: true
                    });
                }).catch(() => {
                    message.reply("An error occured while setting the profile ID.");
                });
            });
        } else {
            connection.prepare("UPDATE pids SET pid=? WHERE user=?").then(prepared => {
                prepared.run([message.args[1], message.author.id]).then(() => {
                    message.reply("Profile ID successfully updated.");
                }).catch(() => {
                    message.reply("An error occured while updating the profile ID.");
                });
            });
        }
    });
}
