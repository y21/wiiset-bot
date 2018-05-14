const { get } = require("snekfetch");

module.exports = async message => {
    let request = await get("http://wiimmfi.glitch.me/users");
    message.channel.send("```js\n" + request.body.join("\n").substr(0, 1980) + "\n```")
};
