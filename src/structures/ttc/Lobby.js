const User = require("./User");
const { LobbyStates } = require("./Gateway");

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

    static get Options() {
        return {
            RT: 1,
            CT: 1 << 1,
            AT: (1 | 1 << 1),
            "150cc": 1 << 3,
            "200cc": 1 << 4,
            NoElimination: 1 << 5,
            Private: 1 << 6,
            Ranked: 1 << 7,
            Bots: 1 << 8,

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
        }
    }

    static get BotsLimit() {
        return 1 << 3;
    }

    static formatOptions(options) {
        const allOptions = [];
    
        if (Lobby.hasOption(options, Lobby.Options["150cc"])) {
            allOptions.push("150cc");
        }
    
        if (Lobby.hasOption(options, Lobby.Options["200cc"])) {
            allOptions.push("200cc");
        }
    
        if (Lobby.hasOption(options, Lobby.Options.AT)) {
            allOptions.push("All Tracks");
        } else if (Lobby.hasOption(options, Lobby.Options.RT)) {
            allOptions.push("RTs");
        } else if (Lobby.hasOption(options, Lobby.Options.CT)) {
            allOptions.push("CTs");
        }
    
        if (Lobby.hasOption(options, Lobby.Options.NoElimination)) {
            allOptions.push("No Elimination");
        }
    
        if (Lobby.hasOption(options, Lobby.Options.Private)) {
            allOptions.push("Private");
        }
    
        if (Lobby.hasOption(options, Lobby.Options.Ranked)) {
            allOptions.push("Ranked");
        }
        
        return allOptions.join(", ");
    }

    static hasOption(options, option) {
        return (options & option) === option;
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