import { makeTypedNullPrototype } from '../utils/utils';
import { LobbyStates } from './types';
import { AiDifficulty } from './user';

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