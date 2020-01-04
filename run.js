const Client = require("./src/Bot");
const Logger = require("./src/structures/Logger");
const config = require("./configs/bot");

(async () => {
    const client = new Client(config);
    client.initCommands();

    try {
        await client.run();
    } catch(e) {
        Logger.error(e);
    }
})();