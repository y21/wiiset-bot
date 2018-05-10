const Discord = require("discord.js"),
    fs = require("fs"),
    client = new Discord.Client(),
    { get } = require("snekfetch"),
    { embedColors, prefix, token } = require("./config.json");
let { wiimmfi_api, commands, utils } = require("./config.json");

for(const dir of fs.readdirSync("./commands/")){
    commands[dir.indexOf(".js") > -1 ? dir.substr(0, dir.search(".js")) : dir] = !dir.endsWith('.js') ? fs.readdirSync(`./commands/${dir}/`).map(file => file.substr(0, file.indexOf(".js"))) : [dir.substr(0, dir.indexOf(".js"))];
}

for(const util of fs.readdirSync("./utils/")){
    utils[util.substr(0, util.search(".js"))] = require(`./utils/${util}`);
}

client.on("message", message => {
    if(message.author.bot) return;
    if(!wiimmfi_api.lastCheck) return message.reply('data hasn\'t been initialized, yet. Please wait some more seconds.');

    message.command = message.content.substr(prefix.length, (message.content.indexOf(" ") > -1 ? message.content.indexOf(" ") - prefix.length : message.content.length))
    message.args = message.content.split(" ").slice(1);
    message.wiimmfi_api = wiimmfi_api;
    message.embedColors = embedColors;
    message.Discord = Discord;
    message.prefix = prefix;


    if(!commands[message.command]) return;
    if(!commands[message.command].includes(message.args[0] || message.command)) return;
    if(message.args.length === 0) require(`./commands/${message.command}.js`)(message);
    else require(`./commands/${message.command}/${message.args[0]}.js`)(message);
});


client.on('ready', async () => {
    console.log(`[${new Date().toLocaleString()}] Bot is ready.`);
    utils.updateData(get).then(res => {
        wiimmfi_api = res;
    });
    utils.updatePresence(wiimmfi_api, client);
    setTimeout(() => utils.updatePresence(wiimmfi_api, client), 30000); // wait 30 seconds until presence change
    setInterval(() => utils.updateData(get), 300000);
    setInterval(() => utils.updatePresence(wiimmfi_api, client), 300000);
});

client.login(token);
