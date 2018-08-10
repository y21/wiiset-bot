const { readdirSync } = require("fs"),
	{ commandDescriptions, prefix } = require("../config.json");

module.exports = async message => {
	const sub = readdirSync("commands"),
		categories = sub.filter(val => !val.endsWith(".js")),
		commands = sub.filter(val => val.endsWith(".js")).map(val2 => val2.substr(0, val2.indexOf(".js"))).concat(categories.map(val2 => readdirSync("commands/" + val2).map(val3 => `${val2}/${val3.substr(0,val3.indexOf(".js"))}`)));
		// Add so-called "general" category
		categories.unshift("general");
		let embed = {
			title: "Help | General | Page 1",
			color: 0xFFFFFF,
			fields: commands.filter(val => !val.includes("/") && val.constructor.name !== "Array").map(val => { return {
				name: `${prefix + val}`,
				value: commandDescriptions[val] || "???"
			}})
		};
		let msg = await message.channel.send({embed: embed}),
		counter = 1;
		msg.react("⬅").then(m => {
            msg.react("➡").catch();
        }).catch();
		const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id && (reaction.emoji.name === "➡" || reaction.emoji.name === "⬅"), { time: 60000 });
		collector.on("collect", reaction => {
			// ignore if <page 1 or >categories.length
			if(reaction.emoji.name === "⬅" && counter === 1) return;
			if(reaction.emoji.name === "➡" && counter === categories.length - 2) return;
			
			let left = reaction.emoji.name === "⬅";
			if(left) --counter;
			else ++counter;
			if(counter === 1) msg.edit({ embed: embed }).catch();
			msg.edit({ embed: {
				title: `Help | ${categories[counter + 1]} | Page ${counter}`,
				color: 0xFFFFFF,
				fields: (commands.filter(val => val.constructor.name === "Array")[counter] || []).map(val => { return {
					name: prefix + val.replace(/\//g, " "),
					value: commandDescriptions[val]
				}})
			}});
			reaction.remove(message.author).catch();
		});
}
