const fetch = require("node-fetch");

module.exports = class WiimmfiRest {
    constructor(host) {
        this.host = host;
    }

    getSSBBStats() {
        return fetch(`${this.host}/ssbb/amount`).then(v => v.json());
    }
}