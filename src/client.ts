import { CommandClient, CommandClientOptions } from 'detritus-client';
import { Database } from './structures/database';
import { Paginator } from 'detritus-pagination';
import * as Constants from './utils/constants';
import { TrackHelper } from './utils/trackhelper';
import { Gateway } from './ttc/gateway';

export class Client extends CommandClient {
    public database: Database;
    public paginator: Paginator;
    public trackHelper: TrackHelper;
    public ttcGateway: Gateway;

    constructor(token: string, options?: CommandClientOptions) {
        super(token, options);

        this.database = new Database;
        this.trackHelper = new TrackHelper;

        this.ttcGateway = new Gateway(this);
        this.paginator = new Paginator(this.client, {
            maxTime: Constants.PAGINATOR_TIME_LIMIT,
            pageNumber: true,
            pageLoop: true
        });
    }

    public async init(): Promise<void> {
        await this.trackHelper.init();
        await super.run();
    }
}