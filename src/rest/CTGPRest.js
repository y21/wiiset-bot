const fetch = require("node-fetch");
const { Regexes } = require("../structures/Constants");

class CTGPRest {
    constructor(host) {
        this.host = host;
    }

    getEndpoint(url) {
        return fetch(url)
            .then(v => {
                if (v.headers.get("content-type") !== "application/json")
                    throw new Error("Invalid content type received");
                else return v;
            })
            .then(v => v.text())
            .then(this.removeBOM)
            .then(JSON.parse);
    }

    getTrack(slot, hash, category) {
        return this.getEndpoint(`${this.host}/leaderboard/${slot}/${hash}/${category}`);
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

    getProfileInfo(pid) {
        return this.getEndpoint(`${this.host}/players/${pid.substr(0, 2)}/${pid.substr(2)}.json`);
    }

    getOriginalTracks() {

    }

    getCustomTracks() {
        
    }

    removeBOM(str) {
        return str.replace(Regexes.BOM, "");
    }
}

module.exports = CTGPRest;