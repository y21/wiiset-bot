const fetch = require("node-fetch");
const { dogAPI } = require("../../configs/apis");

module.exports = {
    name: "dog",
    ownerOnly: false,
    guildOnly: false,
    usesDatabase: false,
    run: async () => {
        const request = await fetch(dogAPI).then(v => v.json());
        return [request.message];
    }
};