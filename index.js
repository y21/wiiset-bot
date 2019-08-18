const Base = require("./Base");
const Server = require("./server/Server");
const base = new Base({
    disableEveryone: true
});
const server = new Server(3000 || process.env.PORT, [
    {
        method: "get",
        path: "/",
        run: (req, res) => res.send(Server.serve("./server/client/index.html"))
    },
    {
        method: "get",
        path: "/api/usage",
        run: (req, res) => {
            base.sqlite.all("SELECT * FROM usageLogs").then(r => {
                res.json(r);
            });
        }
    }
]);
server.init();

base.initializeCommands().then(() => {
    base.initializeUtils().then(() => {
        base.initializeLanguages().then(() => {
            base.openDatabase().then(async () => {
                await base.sqlite.run("CREATE TABLE IF NOT EXISTS commandstats (`name` TEXT, `uses` INTEGER, `lastUsage` TEXT)");
                await base.sqlite.run("CREATE TABLE IF NOT EXISTS licks (`id` TEXT, `amount` INTEGER)");
                await base.sqlite.run("CREATE TABLE IF NOT EXISTS tags (`name` TEXT, `author` TEXT, `content` TEXT, `createdAt` TEXT, `uses` INTEGER)");
                await base.sqlite.run("CREATE TABLE IF NOT EXISTS languages (`guild` TEXT, `lang` TEXT)");
                await base.sqlite.run("CREATE TABLE IF NOT EXISTS pids (`user` TEXT, `pid` TEXT)");
                await base.sqlite.run("CREATE TABLE IF NOT EXISTS usageLogs (`month` INTEGER, `uses` INTEGER)");
            });
        });
    });
});

let messagelogs = [];

setInterval(() => {
    messagelogs = messagelogs.filter(v => Date.now() - v.set < 300000);
}, 300000);

// Events
base.client.on("message", m => require("./events/message.js")({
    production: base.config.production,
    prefix: base.config.prefix,
    message: m,
    Discord: base.discord,
    embedColors: base.config.embedColors,
    wiimmfi_api: base.config.wiimmfi_api,
    fromString: base.FlagStore.fromString,
    FlagStore: base.FlagStore,
    commands: base.config.commands,
    messages: base.messages,
    sqlite: base.sqlite,
    translations: base.translations,
    tracks: base.tracks,
    messagelogs
}));

base.client.on("messageUpdate", (undefined, message) => require("./events/message.js")({
    production: base.config.production,
    prefix: base.config.prefix,
    message,
    Discord: base.discord,
    embedColors: base.config.embedColors,
    wiimmfi_api: base.config.wiimmfi_api,
    fromString: base.FlagStore.fromString,
    FlagStore: base.FlagStore,
    commands: base.config.commands,
    messages: base.messages,
    sqlite: base.sqlite,
    translations: base.translations,
    tracks: base.tracks,
    messagelogs
}));

base.client.on("messageDelete", (message) => require("./events/messageDelete.js")({
    message, messagelogs
}));

base.client.on('ready', () => {
    setTimeout(() => base.config.utils.updatePresence(base.config.wiimmfi_api, base.client), 30000); // wait 30 seconds until presence change
    setInterval(() => base.config.utils.updateData(base.fetch).then(res => base.config.wiimmfi_api = res), 300000);
    setInterval(() => base.config.utils.updatePresence(base.config.wiimmfi_api, base.client), 300000);

    require("./events/ready.js")({
        client: base.client,
        utils: base.config.utils,
        wiimmfi_api: base.config.wiimmfi_api,
        tracks: base.tracks,
        fetch: base.fetch
    }).then(result => {
        base.tracks = result.tracks;
        base.config.wiimmfi_api = result.wiimmfi_api;
    });
});

base.client.on("guildCreate", guild => require("./events/guildCreate")({
    Discord: base.discord,
    client: base.client,
    guild
}));

base.client.on("guildDelete", guild => require("./events/guildDelete")({
    client: base.client,
    guild
}));

base.client.on("error", console.error);

base.client.login(base.config.token);
