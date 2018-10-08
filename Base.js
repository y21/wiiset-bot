module.exports = class Base {
    constructor(clientOptions) {
        this._discord      = require("discord.js");
        this._client       = new this._discord.Client(clientOptions);
        this._fetch        = require("node-fetch");
        this._sqlite       = require("sqlite");
        this._FlagStore    = require("./FlagStore");
        this._config       = require("./config.json");
        this._translations = {};
        this._tracks       = [];
        this._messages     = new Map();
    }

    get discord() {
        return this._discord;
    }

    get client() {
        return this._client;
    }

    get fetch() {
        return this._fetch;
    }

    get sqlite() {
        return this._sqlite;
    }

    get FlagStore() {
        return this._FlagStore;
    }

    get config() {
        return this._config;
    }

    get translations() {
        return this._translations;
    }

    get tracks() {
        return this._tracks;
    }

    get messages() {
        return this._messages;
    }

    set discord(v) {
        return this._discord = v;
    }

    set client(v) {
        return this._client = v;
    }

    set fetch(v) {
        return this._fetch = v;
    }

    set sqlite(v) {
        return this._sqlite = v;
    }

    set FlagStore(v) {
        return this._FlagStore = v;
    }

    set config(v) {
        return this._config = v;
    }

    set translations(v) {
        return this._translations = v;
    }

    set tracks(v) {
        return this._tracks = v;
    }

    set messages(v) {
        return this._messages = v;
    }

    async initializeCommands() {
        const { readdirSync } = require("fs");
        for (const dir of readdirSync("./commands/")) {
            this._config.commands[dir.indexOf(".js") > -1 ? dir.substr(0, dir.search(".js")) : dir] = !dir.endsWith('.js') ? readdirSync(`./commands/${dir}/`).map(file => file.substr(0, file.indexOf(".js"))) : [dir.substr(0, dir.indexOf(".js"))];
        }
        return this._config.commands;
    }

    async initializeUtils() {
        const { readdirSync } = require("fs");
        for (const util of readdirSync("./utils/")) {
            this._config.utils[util.substr(0, util.search(".js"))] = require(`./utils/${util}`);
        }
        return this._config.utils;
    }

    async initializeLanguages() {
        const { readdirSync } = require("fs");
        for(const lang of readdirSync("./lang/")) {
            this._translations[lang.substr(0, lang.indexOf(".json"))] = require(`./lang/${lang}`);
        }
        return this._translations;
    }

    async openDatabase(path) {
        return this._sqlite.open(path || "./database.sqlite");
    }
};