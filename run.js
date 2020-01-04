const Client = require("./src/Bot");
const Logger = require("./src/structures/Logger");
const config = require("./config");

(async () => {
    const client = new Client(config);
    client.initCommands();

    try {
        await client.run();
    } catch(e) {
        Logger.error(e);
    }
})();