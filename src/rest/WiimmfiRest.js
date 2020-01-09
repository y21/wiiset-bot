const fetch = require("node-fetch");

class WiimmfiRest {
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
        return fetch(`${this.host}/mkw/users`)
            .then(v => v.json())
            .then(v => v.slice(0, limit));
    }

    getMKWBans(limit = 10) {
        return fetch(`${this.host}/bans`)
            .then(v => v.json())
            .then(v => v.slice(0, limit));
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
                    roomStart: v.room_start,
                    raceStart: v.race_start,
                    players: v.members.sort((a, b) => b.ev - a.ev)
                };
                stats.highestVR = stats.players[0];
                stats.lowestVR = stats.players.slice(-1)[0];
                stats.averageVR = stats.players.reduce((a, b) => a.ev + b.ev) / stats.players.length
                return stats;
            });
    }
};
WiimmfiRest.originHost = "https://wiimmfi.de";

module.exports = WiimmfiRest;