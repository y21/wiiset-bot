const { readdirSync } = require("fs"),
	{ commandDescriptions, prefix } = require("../config.json");

module.exports = async message => {
	const commandCategories = {
		1: undefined,
		2: "general",
		3: "ctgp",
		4: "mkw",
		5: "mod",
		6: "ssbb",
		7: "tag"
	};
	let page = 1;
	const commands = {
		no_category: readdirSync("./commands/").filter(val => val.endsWith(".js"))
	};
	for(const directory of readdirSync("./commands").filter(val => !val.endsWith(".js"))) {
		commands[directory] = readdirSync("./commands/" + directory);
	}
	// Page 1
	const msg = await message.channel.send({embed: {
		title: "Help page | Page " + page + " | " + commandCategories[page],
		description: "This bot is being developed by y21. It is using several APIs such as the *(unofficial)* [Wiimmfi API](https://github.com/y21/wiimmfi-api) to get data about Wiimmfi (rooms, user information etc.) and the [Time Trial API](http://tt.chadsoft.co.uk/index.json) made by chadderz to get information about ghosts, tracks and more.\n" +
					"The code might have some bugs and the author of this bot is planning to rewrite it soon, therefore you should immediately report them.\n" +
					"**Note:** This bot is *not* affiliated with Wiimmfi.\n" + 
					"This help page will only work for the next 180 seconds (3 minutes).",
		fields: [
			{
				name: "Related links",
				value: "- Any questions or problems? Join our [support server](https://discord.gg/6DPWSmK).\n" +
						"- [Invite me](https://discordapp.com/api/oauth2/authorize?client_id=440210686954569739&permissions=8&scope=bot) (administrator permissions, needed for some commands)\n" +
						"- [Invite me](https://discordapp.com/api/oauth2/authorize?client_id=440210686954569739&permissions=0&scope=bot) (no permissions)\n" +
						"- Want to see how this bot works? Take a look into the [source](https://github.com/y21/wiiset-bot).\n" +
						"- Read more about this bot [here](https://y21.github.io/wiiset-bot/)."
			}
		],
		color: message.member.displayColor || 0x000000
	}}).catch(console.log);

	await msg.react("⬅");
	await msg.react("➡");
	
	const collector = msg.createReactionCollector((reaction, user) => reaction.emoji.name === "➡" || reaction.emoji.name === "⬅", {
		time: 180000
	});

	collector.on("collect", reaction => {
		if (reaction.count === 1) return; // ignore itself
		if (reaction.emoji.name === "➡") {
			if (page - 1 >= Object.keys(commands).length) return;
			++page;
		} else {
			if (page <= 2) return;
			--page;
		}
		msg.edit({embed: {
			title: `Help page | Page ${page} | ${commandCategories[page]}`,
			fields: [undefined, ...Object.values(commands)][page - 1].map(file => {
				return {
					name: prefix + (page === 2 ? file.substr(0, file.indexOf(".js")) : commandCategories[page] + "/" + file.substr(0, file.indexOf(".js"))).replace(/\//g, " "),
					value: commandDescriptions[page === 2 ? file.substr(0, file.indexOf(".js")) : commandCategories[page] + "/" + file.substr(0, file.indexOf(".js"))] || "Command description not found."
				}
			}),
			color: message.member.displayColor || 0x000000
		}}).then(async () => {
			await reaction.remove(message.author).catch();
		}).catch();
	});

	collector.on("end", () => {
		msg.reactions.filter(reaction => reaction.me).map(async reaction => await reaction.remove().catch());
		collector.stop();
	});
}
