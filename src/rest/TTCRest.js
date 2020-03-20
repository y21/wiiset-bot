const fetch = require("node-fetch");

module.exports = class TTCRest {
    constructor(host) {
        this.host = host;
    }

    registerUser(userId, pid) {
        return fetch(`${this.host}/api/v1/users/${userId}`, {
            method: "POST",
            body: JSON.stringify({ pid })
        });
    }

    getUser(userId) {
        return fetch(`${this.host}/api/v1/users/${userId}`);
    }

    getUsers() {
        return fetch(`${this.host}/api/v1/users`);
    }

    createLobby(userId, channelId) {
        return fetch(`${this.host}/api/v1/lobbies`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        });
    }

    getLobby(lobbyId) {
        return fetch(`${this.host}/api/v1/lobbies/${lobbyId}`);
    }

    getLobbies() {
        return fetch(`${this.host}/api/v1/lobbies`);
    }

    getPlayersInLobby(lobbyId) {
        return fetch(`${this.host}/api/v1/lobbies/${lobbyId}/players`);
    }

    addPlayerToLobby(lobbyId, userId) {
        return fetch(`${this.host}/api/v1/lobbies/${lobbyId}/players`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        });
    }

    removePlayerFromLobby(lobbyId, userId) {
        return fetch(`${this.host}/api/v1/lobbies/${lobbyId}/players`, {
            method: "DELETE",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        });
    }

    submitGhost(lobbyId, userId) {
        return fetch(`${this.host}/api/v1/lobbies/${lobbyId}/players/${userId}/ghosts`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        });
    }
}