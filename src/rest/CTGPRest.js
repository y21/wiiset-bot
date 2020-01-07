const fetch = require("node-fetch");

class CTGPRest {
    constructor(host) {
        this.host = host;
    }

    getEndpoint(url) {
        return fetch(url)
            .then(v => v.text())
            .then(this.removeBOM)
            .then(JSON.parse);
    }

    getRecentRecords() {
        return this.getEndpoint(`${this.host}/index.json`)
            .then(v => v.recentRecords);
    }

    removeBOM(str) {
        return str.replace(new RegExp("^[^{}]"), "");
    }
}

module.exports = CTGPRest;