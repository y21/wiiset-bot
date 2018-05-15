const { get } = require("snekfetch"),
    { fromString } = require("../../FlagStore");

module.exports = async message => {
    let request = (await get(`https://wiimmfi.glitch.me/findUser?name=${message.content.split(" ").slice(2).join(" ").substr(0, message.content.indexOf("-flag:") > -1 ? message.content.split(" ").slice(2).join(" ").indexOf("-flag:") - 1 : message.content.split(" ").slice(2).join(" ").length).replace(/ /g, "%20")}${fromString(message.content) ? "&flags=" + fromString(message.content).join(",") : ""}`).catch(console.log)).body;
    if(request.status === 400) return message.reply("user is not in a room (not found)");
    let embed = new message.Discord.RichEmbed()
        .setTitle(`Information about ${message.content.split(" ").slice(2).join(" ").substr(0, message.content.indexOf("-flag:") > -1 ? message.content.split(" ").slice(2).join(" ").indexOf("-flag:") - 1 : message.content.split(" ").slice(2).join(" ").length)}`)
        .addField("VR (versus rating)", request.data.VR || "<:mysterybox:442440471424270339>")
        .addField("BR (battle rating)", request.data.BR ||"<:mysterybox:442440471424270339>")
        .addField("Login region", request.data.loginRegion || "<:mysterybox:442440471424270339>")
        .addField("Game type", request.data.gameType || "<:mysterybox:442440471424270339>")
        .addField("Connection fail", request.data.connectionFail || "—")
        .setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
        .setThumbnail("http://chadsoft.co.uk/wiimmfi/wiimmfi-dark.png")
        .setTimestamp();
    message.channel.send(embed);
};
