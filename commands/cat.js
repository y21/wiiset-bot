const { get } = require("snekfetch");
const { Attachment } = require("discord.js");

module.exports = class CatCommand {
    static run(message) {
        get("http://aws.random.cat/meow").then(result => {
            message.channel.send(new Attachment(result.body.file, "cat.jpg"));
        }).catch(er => {
            message.channel.send("I cannot access the cat api (<http://aws.random.cat/meow>), perhaps it's down?\nERR: `" + er.toString().replace(/for/gi, "Fur") + "`");
        });
    }
};