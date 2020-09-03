import {
    CommandClient,
    CommandClientOptions,
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
import Cmd, { onBefore, onCancel, run } from './structures/basecommand';
import { RestClient } from './rest/restclient';

export class Client {
    public database: Database;
    public paginator: Paginator;
    public trackHelper: TrackHelper;
    public ttcGateway: Gateway;
    public commandClient: CommandClient;
    public restClient: RestClient;

    constructor(token: string, options?: CommandClientOptions) {
        this.commandClient = new CommandClient(token, options);

        this.database = new Database;
        this.trackHelper = new TrackHelper;
        this.restClient = new RestClient;

        this.ttcGateway = new Gateway(this);
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

            if (command.disabled) {
                console.log(`! ${command.name} not loaded due to being disabled`);
                continue;
            }

            this.commandClient.add(Object.assign(<Command.Command>{
                onBefore: onBefore.bind(null, command),
                run: run.bind(null, this, command),
                onCancel,
                responseOptional: true,
                ratelimits: [{
                    type: "user",
                    duration: 1000,
                    limit: 1
                }],
            }, command));

            console.log(`- Loaded command ${command.name + (command.ownerOnly ? ' (owner only)' : '')}`);
        }
    }

    ping() {
        if (this.commandClient.client instanceof ShardClient) {
            return this.commandClient.client.ping();
        }
    }
}