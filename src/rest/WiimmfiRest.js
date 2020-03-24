const fetch = require("node-fetch");

class WiimmfiRest {
    constructor(host) {
        this.host = host;
    }

    /* SSBB */
    getSSBBStats() {
        return fetch(`${this.host}/rsbj/overview`)
            .then(v => v.json());
    }

    /* MKW */
    getMKWUsers(limit = 10) {
        return fetch(`${this.host}/mkw/users`)
            .then(v => v.status === 200 ? v.json() : [])
            .then(v => limit === -1 ? v : v.slice(0, limit));
    }

    getMKWBans(limit = 10) {
        return fetch(`${this.host}/bans`)
            .then(v => v.json())
            .then(v => limit === -1 ? v : v.slice(0, limit));
    }

    getMKWRoomStats(id) {
        return fetch(`${WiimmfiRest.originHost}/mkw?m=json`)
            .then(v => v.json())
            .then(v => {
                const targetRoom = v.find(r => r.room_id === id || r.room_name === id);
                if (!targetRoom)
                    throw new Error("Room not found!");
                else return targetRoom;
            })
            .then(v => {
                const stats = {
                    name: v.room_name,
                    id: v.room_id,
                    roomStart: v.room_start,
                    raceStart: v.race_start,
                    players: v.members.sort((a, b) => b.ev - a.ev)
                };
                stats.highestVR = stats.players[0];
                stats.lowestVR = stats.players.slice(-1)[0];
                stats.averageVR = stats.players.map(v => v.ev).reduce((a, b) => a + b) / stats.players.length;
                return stats;
            });
    }

    getMKWList() {
        return fetch(`${this.host}/mkw/rooms`)
            .then(v => v.json());
    }

    getMKWLoginRegions() {
        return fetch(`${this.host}/mkw/regions`)
            .then(v => v.json());
    }

    getMKWData() {
        return fetch(`${this.host}/rmcj/overview`)
        .then(v => v.json())
        .then(v => v.data);
    }
}
WiimmfiRest.originHost = "https://wiimmfi.de";

module.exports = WiimmfiRest;
