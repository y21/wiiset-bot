const fetch = require("node-fetch");
const { Regexes } = require("../structures/Constants");

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

    getStats() {
        return this.getEndpoint(`${this.host}/index.json`)
            .then(v => ({
                uniquePlayers: v.uniquePlayers,
                leaderboardCount: v.leaderboardCount,
                ghostCount: v.ghostCount
            }));
    }

    removeBOM(str) {
        return str.replace(Regexes.BOM, "");
    }
}

module.exports = CTGPRest;