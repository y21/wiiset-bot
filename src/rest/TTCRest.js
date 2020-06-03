const fetch = require("node-fetch");
const Lobby = require("../structures/ttc/Lobby");
const User = require("../structures/ttc/User");

const AutoDetection = 0;

module.exports = class TTCRest {
    constructor(host, token) {
        this.host = host;
        this.token = token;
    }

    request(url, options) {
        return fetch(url, {
            headers: {
                Authorization: this.token
            },
            ...options,
        }).then(async resp => {
            if (resp.status !== 200) throw new Error(await resp.text());
            else return await resp.json();
        });
    }

    registerUser(userId, pid) {
        return this.request(`${this.host}/api/v1/users/${userId}`, {
            method: "POST",
            body: JSON.stringify({ pid })
        }).then(r => new User(r));
    }

    getUser(userId) {
        return this.request(`${this.host}/api/v1/users/${userId}`).then(r => new User(r));
    }

    getUsers() {
        return this.request(`${this.host}/api/v1/users`)
            .then(r => {
                const arr = [];
                for (const u of r) {
                    arr.push(new User(u));
                }
                return arr;
            });
    }

    createLobby(userId, channelId, options, aiDiffs) {
        // Default to ATs
        if (!Lobby.hasOption(options, Lobby.Options.RT) && !Lobby.hasOption(options, Lobby.Options.CT))
            options |= Lobby.Options.AT;
        
        return this.request(`${this.host}/api/v1/lobbies`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId,
                options,
                aiDiffs
            })
        }).then(r => new Lobby(r));
    }

    getLobby(lobbyId) {
        return this.request(`${this.host}/api/v1/lobbies/${lobbyId}`).then(r => new Lobby(r));
    }

    getLobbies() {
        return this.request(`${this.host}/api/v1/lobbies`)
            .then(r => {
                const arr = [];
                for (const lobby of r) {
                    arr.push(new Lobby(lobby));
                }
                return arr;
            });
    }

    getPlayersInLobby(lobbyId) {
        return this.request(`${this.host}/api/v1/lobbies/${lobbyId}/players`)
            .then(r => {
                const arr = [];
                for (const u of r) {
                    arr.push(new User(u));
                }
                return arr;
            });
    }

    addPlayerToLobby(lobbyId, userId, channelId, password) {
        return this.request(`${this.host}/api/v1/lobbies/${lobbyId}/players`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId,
                password: parseInt(password, 10)
            })
        }).then(r => new Lobby(r));
    }

    removePlayerFromLobby(lobbyId, userId, channelId) {
        return this.request(`${this.host}/api/v1/lobbies/${lobbyId || AutoDetection}/players`, {
            method: "DELETE",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        }).then(r => new Lobby(r));
    }

    submitGhost(lobbyId, userId, channelId) {
        return this.request(`${this.host}/api/v1/lobbies/${lobbyId || AutoDetection}/players/${userId}/ghosts`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        }); // TODO: create ghost class
    }
}