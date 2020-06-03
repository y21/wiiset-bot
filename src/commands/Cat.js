const fetch = require("node-fetch");
const { catAPI } = require("../../configs/apis");

module.exports = {
    name: "cat",
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Sends a random cat image"
    },
    run: async () => {
        const request = await fetch(catAPI).then(v => v.json());
        return [request.file];
    }
};