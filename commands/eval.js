module.exports = message => {
    if (message.author.id === "312715611413413889") {
		try {
			const before = Date.now();
			const evaluation = eval(message.args.join(" "));
			message.channel.send({ embed: {
				title: "Evaluation",
				color: 0x00FF00,
				fields: [
					{
						name: "Type",
						value: typeof evaluation
					},
					{
						name: "Constructor",
						value: (evaluation.constructor || { name: "/" }).name
					},
					{
						name: "Evaluation time",
						value: (Date.now() - before) + " Milliseconds"
					}
				],
				description: "```js\n" + evaluation + "\n```",
				timestamp: new Date()
			}});
		} catch(e) {
			message.channel.send({ embed: {
				title: "Evaluation",
				color: 0xFF0000,
				description: "```js\n" + e + "\n```",
				timestamp: new Date()
			}});
		}
    }
};
