import { makeTypedNullPrototype } from '../utils/utils';
import { LobbyStates, Team } from './types';
import User, { AiDifficulty, UserData } from './user';

export const LobbyOptions = makeTypedNullPrototype({
    RT: 1,
    CT: 1 << 1,
    AT: (1 | 1 << 1),
    '150cc': 1 << 3,
    '200cc': 1 << 4,
    Elimination: 1 << 5,
    Private: 1 << 6,
    Ranked: 1 << 7,
    Bots: 1 << 8,
    Teams: 1 << 9,
    Teams2: 1 << 10,
    Teams3: 1 << 11,
    Teams4: 1 << 12,
    Teams6: 1 << 13,
    NoGlitch: 1 << 14,
});

export default class Lobby {
    public static BOTS_LIMIT = 1 << 3;

    public id: number;
    public creator: User;
    public players: Array<User>;
    public startedAt: number;
    public state: number;
    public round: number;
    public currentTrack: any; // type this
    public originalPlayerCount: number;
    public options: number;
    public password?: string;
    public teams?: Array<Team>;

    constructor(data: any) {
        this.id = data.id;
        this.creator = new User(data.creator);
        this.players = data.players.map((x: UserData) => new User(x));
        this.startedAt = data.startedAt;
        this.state = data.state;
        this.round = data.round;
        this.currentTrack = data.currentTrack;
        this.originalPlayerCount = data.originalPlayerCount;
        this.options = data.options;
        this.teams = data.teams;
        this.password = data.password;
    }

    public teamsToString() {
        return Lobby.teamsToString(this.teams ?? []);
    }

    public static randomizeOptions() {
        const incompatible = [
            [ LobbyOptions["200cc"], LobbyOptions["150cc"] ],
            [ LobbyOptions.Teams2, LobbyOptions.Teams3, LobbyOptions.Teams4, LobbyOptions.Teams6, 0 ],
            [ LobbyOptions.RT, LobbyOptions.CT ]
        ];
    
        const exclude = [ LobbyOptions.Teams, LobbyOptions.Private, ...incompatible.flat() ];

        let localOpt = Object.values(LobbyOptions)
            .reduce((prev: number, cur) => {
                const current = <number>cur; // lol
                return exclude.includes(current) || Math.random() > .5 ? prev + 0 : prev | current;
            }, 0);

        for (const type of incompatible) {
            if (Math.random() > .5) localOpt |= type[~~(Math.random() * type.length)];
        }

        return localOpt;
    }

    public static teamsToString(teams: Array<Team>, sort = true) {
        if (!Array.isArray(teams)) {
            throw new Error('Teams is not an array');
        }

        if (sort) {
            teams = teams.sort((a, b) => b.points - a.points);
        }

        return teams.map(team => {
            const head = `__Team ${team.id} (${~~team.points} points)__`;

            return head + team.players.map(player => {
                const ai = player.aiDiff === AiDifficulty.DISABLED;
                return '- ' + (ai ? `<@${player.userid}>` : User.buildAIName(player.userid, player.aiDiff));
            }).join('\n');
        }).join('\n');
    }

    public static stateToString(state: number) {
        switch (state) {
            case LobbyStates.Waiting:
                return 'Waiting';
            case LobbyStates.ThresholdReached:
                return 'Waiting for more players'
            case LobbyStates.MapPick:
                return 'Picking map'
            case LobbyStates.Preparation:
                return 'Preparing';
            case LobbyStates.Ingame:
                return 'Ingame';
            case LobbyStates.Upload:
                return 'Uploading ghosts';
            default: 
                return '';
        }
    }

    public static formatOptions(options: number) {
        const set = new Set;

        return Object.entries(options).filter(([, bit]) => {
            if ((options & bit) === bit && !set.has(bit)) {
                set.add(bit);
                return true;
            }

            return false;
        }).map(k => k[0]).join(', ');
    }

    public static randomBotDiffs(count: number) {
        return Array(count).fill(null).map(this.randomizeSingleBotDiff);
    }

    public static randomizeSingleBotDiff() {
        return (~~(Math.random() * AiDifficulty.EXPERT)) + 1;
    }
}