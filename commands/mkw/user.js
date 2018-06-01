const { post } = require("snekfetch"),
    { fromString } = require("../../FlagStore");

module.exports = async message => {
    let request = (await post(`https://wiimmfi.glitch.me/findUser?name=${fromString(message.content) ? "&flags=" + fromString(message.content).join(",") : ""}`,
        {
            data: {
                "Content-type": "application/x-www-form-urlencoded",
                name: message.content.split(" ").slice(2).join(" ").substr(0, message.content.indexOf("-flag:") > -1 ? message.content.split(" ").slice(2).join(" ").indexOf("-flag:") - 1 : message.content.split(" ").slice(2).join(" ").length).replace(/ /g, "%20")
            }
        }).catch(console.log)).body;
    if(request.status === 400) return message.reply("user is not in a room (not found). **Note:** the bot will most likely not find users with weird characters in their names.");
    let embed = new message.Discord.RichEmbed()
        .setTitle(`Information about ${message.content.split(" ").slice(2).join(" ").substr(0, message.content.indexOf("-flag:") > -1 ? message.content.split(" ").slice(2).join(" ").indexOf("-flag:") - 1 : message.content.split(" ").slice(2).join(" ").length)}`)
        .addField("VR (versus rating)", request.data.VR || "<:mysterybox:442440471424270339>")
        .addField("BR (battle rating)", request.data.BR ||"<:mysterybox:442440471424270339>")
        .addField("Login region", request.data.loginRegion || "<:mysterybox:442440471424270339>")
        .addField("Game type", request.data.gameType || "<:mysterybox:442440471424270339>")
        .addField("Connection fail", request.data.connectionFail || "—")
        .setThumbnail("http://chadsoft.co.uk/wiimmfi/wiimmfi-dark.png")
        .setTimestamp();
    const cfail = request.data.connectionFail;
    if(cfail){
        if(parseInt(cfail) < 1 && parseInt(cfail) > 0) embed.setColor(0x8cff00);
        else if(parseInt(cfail) >= 1 && parseInt(cfail) < 3) embed.setColor(0xc7ff00);
        else if(parseInt(cfail) >= 3 && parseInt(cfail) < 6) embed.setColor(0xffcc00);
        else if(parseInt(cfail) >= 6 && parseInt(cfail) < 10) embed.setColor(0xff7f00);
        else if(parseInt(cfail) <= 10) embed.setColor(0xff0000);
    } else {
        embed.setColor(0x2aff00);
    }
    message.channel.send(embed);
};
