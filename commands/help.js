const fs = require("fs");
const { commandDescriptions, prefix } = require("../config");

module.exports = message => {
    message.channel.send("This bot was made by y21 **but** is not affiliated with the official online service wiimmfi. For more information please send `" + prefix +"disclaimer`\nRepository: <https://github.com/y21/wiimmfi-bot>\nSupport Server: https://discord.gg/Mm6NWte\n\n__general__\n" + fs.readdirSync("./commands/").map(dir => {
        if(!dir.endsWith(".js")){
            return `\n\n__${dir}__\n` + fs.readdirSync(`./commands/${dir}`).map(file => "**" + prefix + dir + " " + file.substr(0, file.indexOf(".js")) + ":** " + (commandDescriptions.find(e => e.command === file.substr(0, file.indexOf(".js"))) || { value: "command not found" }).value).join("\n")
        } else {
            return `**${prefix + dir.substr(0, dir.indexOf(".js"))}:** ${(commandDescriptions.find(e => e.command === dir.substr(0, dir.indexOf(".js"))) || { value: "command not found" }).value}`;
        }
    }).join("\n"));
};
