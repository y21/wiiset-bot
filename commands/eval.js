module.exports = message => {
    if (message.author.id === "312715611413413889") {
        const client = message.client;
        message.channel.send(`\`\`\`js\n${require('util').inspect(eval(message.content.split(" ").slice(1).join(" ")))}\`\`\``);
    }
};
