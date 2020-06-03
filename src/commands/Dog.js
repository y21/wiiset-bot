const fetch = require("node-fetch");
const { dogAPI } = require("../../configs/apis");

module.exports = {
    name: "dog",
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Sends a random dog image"
    },
    run: async () => {
        const request = await fetch(dogAPI).then(v => v.json());
        return [request.message];
    }
};