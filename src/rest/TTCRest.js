const fetch = require("node-fetch");
const { hasOption, Options: LobbyOptions } = require("../structures/ttc/Lobby");

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
        })
    }

    registerUser(userId, pid) {
        return this.request(`${this.host}/api/v1/users/${userId}`, {
            method: "POST",
            body: JSON.stringify({ pid })
        });
    }

    getUser(userId) {
        return this.request(`${this.host}/api/v1/users/${userId}`);
    }

    getUsers() {
        return this.request(`${this.host}/api/v1/users`);
    }

    createLobby(userId, channelId, options) {
        // Default to ATs
        if (!hasOption(options, LobbyOptions.RT) && !hasOption(options, LobbyOptions.CT))
            options |= LobbyOptions.AT;
        
        return this.request(`${this.host}/api/v1/lobbies`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId,
                options
            })
        });
    }

    getLobby(lobbyId) {
        return this.request(`${this.host}/api/v1/lobbies/${lobbyId}`);
    }

    getLobbies() {
        return this.request(`${this.host}/api/v1/lobbies`);
    }

    getPlayersInLobby(lobbyId) {
        return this.request(`${this.host}/api/v1/lobbies/${lobbyId}/players`);
    }

    addPlayerToLobby(lobbyId, userId, channelId, password) {
        return this.request(`${this.host}/api/v1/lobbies/${lobbyId}/players`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId,
                password: parseInt(password, 10)
            })
        });
    }

    removePlayerFromLobby(lobbyId, userId, channelId) {
        return this.request(`${this.host}/api/v1/lobbies/${lobbyId}/players`, {
            method: "DELETE",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        });
    }

    submitGhost(lobbyId, userId, channelId) {
        return this.request(`${this.host}/api/v1/lobbies/${lobbyId}/players/${userId}/ghosts`, {
            method: "POST",
            body: JSON.stringify({
                userid: userId,
                channel: channelId
            })
        });
    }
}