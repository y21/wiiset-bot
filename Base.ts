import * as Discord from "discord.js";
import * as sqlite from "sqlite";
import Command from "./structures/Command";
import {User} from "discord.js";

export default class Base {
    static guildLogChannel: string = "445297325095780372";
    static owner: User | undefined;
    static wiimmfiAPI = "https://wiimmfi.glitch.me";
    public client: Discord.Client;
    public sqlite: any;
    public FlagStore: any; //TODO: Write FlagStore
    public config: {
        prefix: string,
        token: string,
        wrAuthToken: string
    };
    public translations: any;
    public tracks: any;
    public messages: Map<string, number>;
    public commands: Map<string, Command>;

    constructor(ClientOptions: Discord.ClientOptions, dbPath: string = "./db.sqlite") {
        this.client = new Discord.Client(ClientOptions);
        this.translations = {};
        this.tracks = [];
        this.messages = new Map();
        this.commands = new Map();
        this.sqlite = sqlite;
        this.config = require("./config.json");
        this.openDatabase("./database.sqlite");
    }

    async openDatabase(path: string): Promise<any> {
        await this.sqlite.open(path || "./database.sqlite");
        await this.sqlite.run("CREATE TABLE IF NOT EXISTS commandstats (`name` TEXT, `uses` INTEGER, `lastUsage` TEXT)");
        await this.sqlite.run("CREATE TABLE IF NOT EXISTS licks (`id` TEXT, `amount` INTEGER)");
        await this.sqlite.run("CREATE TABLE IF NOT EXISTS tags (`name` TEXT, `author` TEXT, `content` TEXT, `createdAt` TEXT, `uses` INTEGER)");
        await this.sqlite.run("CREATE TABLE IF NOT EXISTS languages (`guild` TEXT, `lang` TEXT)");
        await this.sqlite.run("CREATE TABLE IF NOT EXISTS pids (`user` TEXT, `pid` TEXT)");
        await this.sqlite.run("CREATE TABLE IF NOT EXISTS usageLogs (`month` INTEGER, `uses` INTEGER)");
    }
}