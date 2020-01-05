const Client = require("./src/Bot");
const Logger = require("./src/structures/Logger");
const config = require("./configs/bot");
const database = require("./configs/database");

(async () => {
    const client = new Client(config, database);
    client.initCommands();

    try {
        await client.run();
    } catch(e) {
        Logger.error(e);
    }
})();