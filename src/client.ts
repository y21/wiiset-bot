import {
    CommandClient,
    CommandClientOptions,
    ClusterClient,
    Command,
    ShardClient
} from 'detritus-client';
import {
    Database
} from './structures/database';
import {
    Paginator
} from 'detritus-pagination';
import * as Constants from './utils/constants';
import { TrackHelper } from './utils/trackhelper';
import { Gateway } from './ttc/gateway';
import * as fs from 'fs';
import Cmd from './structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { RestClient } from './rest/restclient';
import { messageSystemContent } from 'detritus-client/lib/structures';

export class Client {
    public database: Database;
    public paginator: Paginator;
    public trackHelper: TrackHelper;
    // public ttcGateway: Gateway;
    public commandClient: CommandClient;
    public restClient: RestClient;

    constructor(token: string, options?: CommandClientOptions) {
        this.commandClient = new CommandClient(token, options);

        this.database = new Database;
        this.trackHelper = new TrackHelper;
        this.restClient = new RestClient;

        // this.ttcGateway = new Gateway(this);
        this.paginator = new Paginator(this.commandClient.client, {
            maxTime: Constants.PAGINATOR_TIME_LIMIT,
            pageNumber: true,
            pageLoop: true
        });
    }

    public async init(): Promise<void> {
        await this.trackHelper.init();
        await this.commandClient.run();

        await this.loadCommands();
    }

    private async loadCommands() {
        const files = await fs.promises.readdir(`${__dirname}/commands`);

        for (const file of files.filter(x => x.endsWith('.js'))) {
            const command: Cmd = await import(`./commands/${file}`).then(x => x.default);

            this.commandClient.add(Object.assign(<Command.Command>{
                onBefore: (context: Context) => command.ownerOnly ? context.client.isOwner(context.userId) : true,
                onCancel: (context: Context) => context.reply(Constants.UNKNOWN_CMD_ERROR),
                responseOptional: true,
                ratelimits: [{
                    type: "user",
                    duration: 1000,
                    limit: 1
                }],
                run: async (context, args) => {
                    try {
                        await command.onrun(this, context, args);
                    } catch(e) {
                        // TODO: sanitize error message (hide IPs)
                        await context.reply(e.message);
                    }
                }
            }, command));

            console.log(`- Loaded command ${command.name + (command.ownerOnly ? ' (owner only)' : '')}`);
        }
    }
}