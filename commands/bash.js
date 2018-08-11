module.exports = message => {
	if (message.author.id !== "312715611413413889") return;
	const { execSync } = require("child_process");
	try {
		message.reply(execSync(message.args.join(" ")).toString(), {
			code: message.flags.includes("nc") ? undefined : "js"
		});
	} catch(e) {
		message.reply(e);
	}
}
