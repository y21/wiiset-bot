const Discord = require("discord.js"),
    fs = require("fs"),
    client = new Discord.Client({
        disableEveryone: true
    }),
    fetch = require("node-fetch"),
    { embedColors, prefix, token } = require("./config.json"),
    sqlite = require("sqlite"),
    FlagStore = require("./FlagStore"),
    { fromString } = FlagStore;
let { wiimmfi_api, commands, utils, production } = require("./config.json"),
    translations = { },
    tracks = [ ];

for (const dir of fs.readdirSync("./commands/")) {
    commands[dir.indexOf(".js") > -1 ? dir.substr(0, dir.search(".js")) : dir] = !dir.endsWith('.js') ? fs.readdirSync(`./commands/${dir}/`).map(file => file.substr(0, file.indexOf(".js"))) : [dir.substr(0, dir.indexOf(".js"))];
}

for (const util of fs.readdirSync("./utils/")) {
    utils[util.substr(0, util.search(".js"))] = require(`./utils/${util}`);
}

for(const lang of fs.readdirSync("./lang/")) {
    translations[lang.substr(0, lang.indexOf(".json"))] = require(`./lang/${lang}`);
}

// Create tables in case they don't exist
(async () => {
    await sqlite.open("./database.sqlite");
    await sqlite.run("CREATE TABLE IF NOT EXISTS commandstats (`name` TEXT, `uses` INTEGER)");
    await sqlite.run("CREATE TABLE IF NOT EXISTS licks (`id` TEXT, `amount` INTEGER)");
    await sqlite.run("CREATE TABLE IF NOT EXISTS tags (`name` TEXT, `author` TEXT, `content` TEXT, `createdAt` TEXT, `uses` INTEGER)");
    await sqlite.run("CREATE TABLE IF NOT EXISTS languages (`guild` TEXT, `lang` TEXT)");
    await sqlite.run("CREATE TABLE IF NOT EXISTS pids (`user` TEXT, `pid` TEXT)");
})();

// Anti-Spam
const messages = new Map();

// Events
client.on("message", m => require("./events/message.js")({
    production, prefix, message: m, Discord, embedColors, wiimmfi_api, fromString, FlagStore, commands, messages, sqlite, translations, tracks
}));
client.on('ready', () => {
    setTimeout(() => utils.updatePresence(wiimmfi_api, client), 30000); // wait 30 seconds until presence change
    setInterval(() => utils.updateData(fetch).then(res => wiimmfi_api = res), 300000);
    setInterval(() => utils.updatePresence(wiimmfi_api, client), 300000);

    require("./events/ready.js")({
        client, utils, wiimmfi_api, tracks, fetch
    }).then(result => {
        tracks = result.tracks;
        wiimmfi_api = result.wiimmfi_api;
    });
});
client.on("guildCreate", guild => require("./events/guildCreate")({
    Discord, client, guild
}));

client.on("guildDelete", guild => require("./events/guildDelete")({
    client, guild
}));
client.on("error", console.error);

client.login(token);
