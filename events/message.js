const fs = require("fs");

module.exports = async data => {
    const { production, prefix, message, Discord, embedColors, wiimmfi_api, fromString, FlagStore, commands, messages, sqlite, translations, tracks } = data;
    // DM & production mode test, adding required data to message object...
    if(!message.guild && message.author.id !== client.user.id) return message.channel.send("⛔ I don't work in direct messages!");
    if(production && message.author.id !== "312715611413413889") return;
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    message.command = message.content.substr(prefix.length, (message.content.indexOf(" ") > -1 ? message.content.indexOf(" ") - prefix.length : message.content.length))
    message.args = message.content.replace(new RegExp("-(-|flag:)((\\w+)(=.{1,64})?,?)+$", "g"), "").split(" ").slice(1);
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
                for(const flag of require("../FlagStore").flags) {
                    if (!FlagStore.flags.includes(flag)) FlagStore.flags.push(flag);
                }
                return;
            }
            delete require.cache[require.resolve(`../commands/${message.args[0]}${message.args[1] ? "/" + message.args[1] + ".js" : ".js"}`)];
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
    if (message.args.length === 0 || fs.existsSync("./commands/" + message.command + ".js")) require(`../commands/${message.command}.js`).run(message);
    else require(`../commands/${message.command}/${message.args[0]}.js`).run(message);
};
