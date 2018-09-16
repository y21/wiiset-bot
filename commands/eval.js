module.exports = async message => {
    if (message.author.id !== "312715611413413889") return;
    if (message.args.length < 1) return message.reply("Nothing to evaluate...");

    const embed = {
        color: (message.member || {
            displayColor: 0x00FF00
        }).displayColor,
        title: "Evaluation",
        fields: [{
            name: "Input",
            value: "```js\n" + message.args.join(" ") + "\n```"
        }]
    };
    const oldts = Date.now();
    let evaluation;
    try {
        evaluation = eval(message.args.join(" "));
        if (typeof evaluation !== "undefined") {
            if (evaluation.constructor.name === "Promise") {
                embed.fields.push({
                    name: "Output",
                    value: "```js\n" + require("util").inspect(await evaluation).substr(0, 1000) + "\n```"
                });
            } else embed.fields.push({
                name: "Output",
                value: "```js\n" + require("util").inspect(evaluation).substr(0, 1000).replace(message.client.token, "[TOKEN REDACTED]") + "\n```"
            });
        } else embed.fields.push({
            name: "Output",
            value: "```js\n" + evaluation.substr(0, 1000) + "\n```"
        });
    } catch (e) {
        embed.fields.push({
            name: "Output",
            value: "```js\n" + e + "\n```"
        });
        embed.color = 0xFF0000
    }

    embed.fields.push({
        name: "Evaluation time",
        value: (Date.now() - oldts) + " Milliseconds"
    });

    message.channel.send({
        embed
    });
};
