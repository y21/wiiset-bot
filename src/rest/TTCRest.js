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

    createLobby(userId, channelId, options) {
        // Default to RTs
        if ((options & LobbyOptions.RT) !== LobbyOptions.RT && (options & LobbyOptions.CT) !== LobbyOptions.CT)
            options |= LobbyOptions.RT;
        
        return fetch(`${this.host}/api/v1/lobbies`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId,
                options
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

    addPlayerToLobby(lobbyId, userId, channelId) {
        return fetch(`${this.host}/api/v1/lobbies/${lobbyId}/players`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        });
    }

    removePlayerFromLobby(lobbyId, userId, channelId) {
        return fetch(`${this.host}/api/v1/lobbies/${lobbyId}/players`, {
            method: "DELETE",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        });
    }

    submitGhost(lobbyId, userId, channelId) {
        return fetch(`${this.host}/api/v1/lobbies/${lobbyId}/players/${userId}/ghosts`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        });
    }
}

module.exports.LobbyOptions = {
    RT: 0x1,
    CT: 0x2,
    AT: 0x1 | 0x2,
    "150cc": 0x8,
    "200cc": 0x10,
    NoElimination: 0x20
};