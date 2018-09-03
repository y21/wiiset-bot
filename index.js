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
    await sqlite.run("CREATE TABLE IF NOT EXISTS language (`guild` TEXT, `lang` TEXT)");
  })();

// Anti-Spam
const messages = new Map();

client.on("message", async message => {
    // DM & production mode test, adding required data to message object...
    if(!message.guild && message.author.id !== client.user.id) return message.channel.send("⛔ I don't work in direct messages!");
    if(production && message.author.id !== "312715611413413889") return;
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    message.command = message.content.substr(prefix.length, (message.content.indexOf(" ") > -1 ? message.content.indexOf(" ") - prefix.length : message.content.length))
    message.args = message.content.replace(new RegExp(new RegExp("-flag:(" + FlagStore.flags.join("|") + ")(,(" + FlagStore.flags.join("|") + "))* *$", "g")), "").split(" ").slice(1);
    message.wiimmfi_api = wiimmfi_api;
    message.embedColors = embedColors;
    message.Discord = {
        RichEmbed: Discord.RichEmbed
    };
    message.prefix = prefix;
    message.connection = sqlite;
    message.flags = fromString(message.content);

    // Recache command
    if (message.content.startsWith(`${prefix}recache`) && message.author.tag === "y21#0909") {
        try {
            if(message.args[0] === "FlagStore") {
              for(const flag of require("./FlagStore").flags) {
	             if (!FlagStore.flags.includes(flag)) FlagStore.flags.push(flag);
                }
                return;
            }
            delete require.cache[require.resolve(`./commands/${message.args[0]}${message.args[1] ? "/" + message.args[1] + ".js" : ".js"}`)];
            message.reply("Command recached.");
        } catch (e) {
            message.reply("Nope, an error occured: `" + e.toString() + "`");
        }
    }

    // Command checks
    if (!commands[message.command]) return;
    if (!commands[message.command].includes(message.command) && !commands[message.command].includes(message.args[0])) return;
    if (!wiimmfi_api.lastCheck) return message.reply('data hasn\'t been initialized, yet. Please wait some more seconds.');

    // Cooldown check
    if (messages.get(message.author.id) !== undefined && Date.now() - messages.get(message.author.id) < 1000) return message.reply("calm down! [Don't spam]");
    messages.set(message.author.id, Date.now());

    // Increase command in database
    sqlite.get("SELECT * FROM commandstats WHERE name='" + message.command + "'").then(result => {
        if (!result) {
            sqlite.run("INSERT INTO commandstats VALUES ('" + message.command + "', 1)");
        } else sqlite.run("UPDATE commandstats SET uses=" + (result.uses + 1) + " WHERE name='" + message.command + "'");
    }).catch(err => {
        if (err.toString().includes("no such table: commandstats")) {
            sqlite.run("CREATE TABLE commandstats (`name` TEXT, `uses` INTEGER)").catch();
        }
    });

    // Languages
    let language = await message.connection.get("SELECT * FROM languages WHERE guild=" + message.guild.id);
    if(!language) message.translations = translations.en;
    else message.translations = translations[language.lang] || { commands: { } };
    if (message.args[0] === "top" && message.command === "ctgp") {
        message.tracks = tracks;
    }

    // Execute command
    if (message.flags.includes("del")) message.delete().catch(console.log);
    if (message.args.length === 0 || fs.existsSync("./commands/" + message.command + ".js")) require(`./commands/${message.command}.js`)(message);
    else require(`./commands/${message.command}/${message.args[0]}.js`)(message);
});


client.on('ready', async () => {
    console.log(`[${new Date().toLocaleString()}] Bot is ready (${client.guilds.size} Servers and ${client.users.size} Users.)`);
    
    // Getting data from Wiimmfi API 
    utils.updateData(fetch).then(res => {
        wiimmfi_api = res;
    });
    utils.updatePresence(wiimmfi_api, client);
    setTimeout(() => utils.updatePresence(wiimmfi_api, client), 30000); // wait 30 seconds until presence change
    setInterval(() => utils.updateData(fetch).then(res => wiimmfi_api = res), 300000);
    setInterval(() => utils.updatePresence(wiimmfi_api, client), 300000);

    // Course initialization
    let course = {
        original: JSON.parse((await (await fetch("http://tt.chadsoft.co.uk/original-track-leaderboards.json")).text()).replace(/^\s*/, "")),
        cts: JSON.parse((await (await fetch("http://tt.chadsoft.co.uk/ctgp-leaderboards.json")).text()).replace(/^\s*/, ""))
    };
    
    for(const category of Object.entries(course)) {
        for(const track of category[1].leaderboards) {
            if(!tracks.find(val => val.name === track.name)) {
                tracks.push({
                    name: track.name,
                    id: track.trackId,
                    href: track._links.item.href
                });
            }
        }
    }

});

client.on("guildCreate", guild => {
    client.channels.get("445297325095780372").send(new Discord.RichEmbed()
        .setTitle("A new guild: " + guild.name)
        .setColor(0xffff00)
        .setThumbnail(guild.iconURL)
        .addField("Members", guild.memberCount)
        .addField("Bots", (guild.members.filter(m => m.user.bot).size / guild.memberCount * 100).toFixed(1) + "%")
        .setFooter("Amount of guilds: " + client.guilds.size)
    ).then(msg => {
        msg.react("445296718070808586");
    }).catch(console.log);
});

client.on("guildDelete", guild => {
    client.channels.get("445300348903751691").send(new Discord.RichEmbed()
        .setTitle("We lost a guild: " + guild.name)
        .setColor(0xff0000)
        .setThumbnail(guild.iconURL)
        .addField("Members", guild.memberCount)
        .addField("Bots", (guild.members.filter(m => m.user.bot).size / guild.memberCount * 100).toFixed(1) + "%")
        .setFooter("Amount of guilds: " + client.guilds.size)
    ).catch(console.log);
});

client.on("error", console.error);
client.login(token);
