const fetch = require("node-fetch");
const { LobbyStates } = require("../structures/TTCGateway");

const LobbyOptions = {
    RT: 0x1,
    CT: 0x2,
    AT: 0x1 | 0x2,
    "150cc": 0x8,
    "200cc": 0x10,
    NoElimination: 0x20
};

/**
 * Formats lobby options
 * 
 * @param {number} options
 * @returns {string}
 */
function formatLobbyOptions(options) {
    const allOptions = [];
    
    if (hasOption(options, LobbyOptions["150cc"]))
        allOptions.push("150cc");

    if (hasOption(options, LobbyOptions["200cc"]))
        allOptions.push("200cc");

    if (hasOption(options, LobbyOptions.AT))
        allOptions.push("All Tracks");
    else if (hasOption(options, LobbyOptions.RT))
        allOptions.push("RTs");
    else if (hasOption(options, LobbyOptions.CT))
        allOptions.push("CTs");

    if (hasOption(options, LobbyOptions.NoElimination))
        allOptions.push("No Elimination");
    

    return allOptions.join(", ");
}

/**
 * Checks whether an option is selected
 * 
 * @param {number} options 
 * @param {number} option
 * @returns {boolean}
 */
function hasOption(options, option) {
    return (options & option) === option;
}

/**
 * Formats a lobby state
 * @param {number} state
 * @returns {string?}
 */
function stateToString(state) {
    switch (state) {
        case LobbyStates.Waiting:
            return "Waiting";
            break;
        case LobbyStates.ThresholdReached:
            return "Waiting for more players"
            break;
        case LobbyStates.MapPick:
            return "Picking map"
            break;
        case LobbyStates.Preparation:
            return "Preparing";
            break;
        case LobbyStates.Ingame:
            return "Ingame";
            break;
        case LobbyStates.Upload:
            return "Uploading ghosts";
            break;
    }
}

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

module.exports.LobbyOptions = LobbyOptions;
module.exports.formatLobbyOptions = formatLobbyOptions;
module.exports.stateToString = stateToString;