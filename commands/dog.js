const { get } = require("snekfetch");
const { Attachment } = require("discord.js");

module.exports = class DogCommand {
    static run(message) {
        get("https://dog.ceo/api/breeds/image/random").then(result => {
            message.channel.send(new Attachment(result.body.message, "cat.jpg"));
        }).catch(er => {
            message.channel.send("dog api machine broke");
        });
    }
};
