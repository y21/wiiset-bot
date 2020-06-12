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

/**
 * Randomizes lobby options
 * 
 * @returns {number}
 */

function randomizeOptions() {
    const incompatible = [
        [ options["200cc"], options["150cc"] ],
        [ options.Teams2, options.Teams3, options.Teams4, options.Teams6, 0 ],
        [ options.RT, options.CT ]
    ];
    
    const exclude = [ options.Teams, options.Private, ...incompatible.flat() ];

    let localOpt = Object.values(options).reduce((prev, cur) => exclude.includes(cur) || Math.random() > .5 ? prev + 0 : prev | cur, 0);

    for (const type of incompatible) {
        if (Math.random() > .5) localOpt |= type[(Math.random() * type.length) | 0];
    }

    return localOpt;
}

/**
 * Randomizes bot difficulties
 * 
 * @returns {number}
 */
function randomizeBotDiffs(count) {
    return Array(count).fill().map(() => (Math.random() * User.AiDifficulty.EXPERT | 0) + 1);
}

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
        this.teams = data.teams ? Object.values(data.teams).sort((a, b) => b.points - a.points) : [];
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
        return Lobby.teamsToString(this.teams, false);
    }

    static teamsToString(teams, sort = false) {
        if (!Array.isArray(teams)) {
            throw new Error("Teams is not an array");
        }

        if (sort) {
            teams = teams.sort((a, b) => b.points - a.points);
        }

        return teams.map(team => {
            const head = `__Team ${team.id} (${team.points | 0} points):__\n`;
            return head + team.players.map(player => {
                const ai = player.aiDiff === User.AiDifficulty.DISABLED;
                return "- " + (ai ? `<@${player.userid}>` : User.buildAIName(player.userid, player.aiDiff));
            }).join("\n");
        }).join("\n");
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

        if (Lobby.hasOption(checkOptions, options.Teams)) {
            allOptions.push("Teams");
        }

        if (Lobby.hasOption(checkOptions, options.Bots)) {
            allOptions.push("Bots");
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
module.exports.randomizeOptions = randomizeOptions;
module.exports.randomizeBotDiffs = randomizeBotDiffs;