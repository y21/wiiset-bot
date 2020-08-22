export const AiDifficulty = Object.freeze({
    DISABLED: 0,
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
    EXPERT: 4
});

export interface UserData {
    userid: string;
    notificationChannel: string;
    base_rating: number;
    total_rating: number;
    pid: string;
    ghost: string;
    tier: string;
    aiDiff: number;
}

export default class User {
    public id: string;
    public notificationChannel: string;
    public baseRating: number;
    public totalRating: number;
    public pid: string;
    public ghost: string;
    public tier: string;
    public aiDiff: number;

    constructor(data: UserData) {
        this.id = data.userid;
        this.notificationChannel = data.notificationChannel;
        this.baseRating = data.base_rating;
        this.totalRating = data.total_rating;
        this.pid = data.pid;
        this.ghost = data.ghost;
        this.tier = data.tier;
        this.aiDiff = data.aiDiff;
    }

    get rating() {
        return this.baseRating + this.totalRating;
    }

    static diffToString(diff: number) {
        // @ts-ignore
        return Object.keys(AiDifficulty).find(v => AiDifficulty[v] === diff);
    }

    static buildAIName(uid: string, diff: number) {
        return `CPU #${uid} (${this.diffToString(diff)})`;
    }
}