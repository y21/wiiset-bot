module.exports = message => {
    message.connection.all("SELECT * FROM commandstats ORDER BY uses DESC").then(result => {
        message.channel.send("```https\n" + (result.map(element => element.name + ": " + element.uses + " uses").join("\n")) + "\n```");
    });
};
