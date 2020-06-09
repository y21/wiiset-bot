const User = require("./User");
const { LobbyStates } = require("./Gateway");

const options = {
    RT: 1,
    CT: 1 << 1,
    AT: (1 | 1 << 1),
    "150cc": 1 << 3,
    "200cc": 1 << 4,
    Elimination: 1 << 5,
    Private: 1 << 6,
    Ranked: 1 << 7,
    Bots: 1 << 8,
    Teams: 1 << 9,
    Teams2: 1 << 10,
    Teams3: 1 << 11,
    Teams4: 1 << 12,
    Teams6: 1 << 13,

    // Aliases
    get AllTracks() {
        return this.AT;
    },
    get RTs() {
        return this.RT;
    },
    get CTs() {
        return this.CT;
    },
    get NoElim() {
        return this.NoElimination;
    },
    get Password() {
        return this.Private;
    }
};

module.exports = class Lobby {
    constructor(data) {
        this.id = data.id;
        this.creator = new User(data.creator);
        this.players = data.players.map(v => new User(v));
        this.startedAt = data.startedAt;
        this.state = data.state;
        this.round = data.round;
        this.currentTrack = data.currentTrack;
        this.originalPlayerCount = data.originalPlayerCount;
        this.options = data.options;
        this.password = data.password;
        this.teams = Object.values(data.teams);
    }

    formatOptions() {
        return Lobby.formatOptions(this.options);
    }

    hasOption(option) {
        return Lobby.hasOption(this.options, option);
    }

    stateToString() {
        return Lobby.stateToString(this.state);
    }

    teamsToString() {
        // TODO: use user objects
        return this.teams.map(v => `__Team ${v.id}:__\n` + v.players.map(p => `- ${p.aiDiff === User.AiDifficulty.DISABLED ? `<@${p.userid}>` : p.userid}`).join("\n")).join("\n");
    }

    static formatOptions(checkOptions) {
        const allOptions = [];
    
        if (Lobby.hasOption(checkOptions, options["150cc"])) {
            allOptions.push("150cc");
        }
    
        if (Lobby.hasOption(checkOptions, options["200cc"])) {
            allOptions.push("200cc");
        }
    
        if (Lobby.hasOption(checkOptions, options.AT)) {
            allOptions.push("All Tracks");
        } else if (Lobby.hasOption(checkOptions, options.RT)) {
            allOptions.push("RTs");
        } else if (Lobby.hasOption(checkOptions, options.CT)) {
            allOptions.push("CTs");
        }
    
        if (Lobby.hasOption(checkOptions, options.NoElimination)) {
            allOptions.push("No Elimination");
        }
    
        if (Lobby.hasOption(checkOptions, options.Private)) {
            allOptions.push("Private");
        }
    
        if (Lobby.hasOption(checkOptions, options.Ranked)) {
            allOptions.push("Ranked");
        }
        
        return allOptions.join(", ");
    }

    static hasOption(checkOptions, option) {
        return (checkOptions & option) === option;
    }

    static stateToString(state) {
        switch (state) {
            case LobbyStates.Waiting:
                return "Waiting";
            case LobbyStates.ThresholdReached:
                return "Waiting for more players"
            case LobbyStates.MapPick:
                return "Picking map"
            case LobbyStates.Preparation:
                return "Preparing";
            case LobbyStates.Ingame:
                return "Ingame";
            case LobbyStates.Upload:
                return "Uploading ghosts";
        }
    }
}

module.exports.Options = options;
module.exports.BotsLimit = 1 << 3;