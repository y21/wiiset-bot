const fetch = require("node-fetch");

module.exports = class CaptionCommand {
    static run(message) {
        const imageURL = message.attachments.size > 0 ? message.attachments.first().url : message.args.join(" ");
        if (!imageURL) return message.reply("please provide an image either by sending one or by sending a link");
        message.channel.startTyping();
        fetch("https://captionbot.azurewebsites.net/api/messages?language=en-US", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Type: "CaptionRequest",
                Content: imageURL
            })
        }).then(v => v.text()).then(res => {
            message.channel.send(res).then(() => message.channel.stopTyping);
        }).catch(err => {
            message.channel.send("An error occurred: " + err);
        });
    }
};
