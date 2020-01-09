const fetch = require("node-fetch");

module.exports = class WiimmfiRest {
    constructor(host) {
        this.host = host;
    }

    /* SSBB */
    getSSBBStats() {
        return fetch(`${this.host}/ssbb/amount`)
            .then(v => v.json());
    }

    /* MKW */
    getMKWUsers(limit = 10) {
        return fetch(`${this.hosts}/mkw/users`)
            .then(v => v.json())
            .then(v => v.slice(0, limit));
    }

    getMKWBans(limit = 10) {
        return fetch(`${this.hosts}/bans`)
            .then(v => v.json())
            .then(v => v.slice(0, limit));
    }
}