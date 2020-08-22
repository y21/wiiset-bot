import {
    Client
} from './client';
import * as botConfig from '../configs/bot.json';

import {
    TrackHelper
} from './utils/trackhelper';

(async () => {
    const client = new Client(botConfig.token, {
        prefix: botConfig.prefix,
        shards: [0, 1],
        isBot: true,
        mentionsEnabled: false,
        activateOnEdits: true,
        cache: false,
        gateway: {
            intents: (1 << 9) | (1 << 12) | (1 << 10),
            autoReconnect: true,
            identifyProperties: {
                $browser: "Discord iOS"
            }
        }
    });

    await client.init();
})();