const fs = require("fs");
const { commandDescriptions, prefix } = require("../config");

module.exports = message => {
    message.channel.send("This bot was made by y21 **but** is not affiliated with the official online service wiimmfi. For more information please send `" + prefix +"disclaimer`\nRepository: <https://github.com/y21/wiiset-bot>\nSupport Server: https://discord.gg/6DPWSmK\n\n__general__\n" + fs.readdirSync("./commands").filter(val => val.endsWith(".js")).map(val => {
    return `**${prefix + val.substr(0, val.indexOf(".js"))}**: ${commandDescriptions.find(val2 => val2.command === val.substr(0, val.indexOf(".js"))).value}`;
    }).join("\n") + fs.readdirSync("./commands/").map(dir => {
        if(!dir.endsWith(".js")){
            return `__${dir}__\n${fs.readdirSync(`./commands/${dir}`).map(val => "**" + prefix + dir + " " + val.substr(0, val.indexOf(".js")) + "**: " + commandDescriptions.find(val2 => val2.command === val.substr(0, val.indexOf(".js"))).value).join("\n")}`;
        }
    }).join("\n"));
};
