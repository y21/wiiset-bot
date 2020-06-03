const AiDifficulty = {
    DISABLED: 0,
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
    EXPERT: 4
};

module.exports = class User {
    constructor(data) {
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

    static diffToString(diff) {
        return Object.keys(AiDifficulty).find(v => AiDifficulty[v] === diff);
    }

    static buildAIName(uid, diff) {
        return `CPU #${uid} (${this.diffToString(diff)})`;
    }
}

module.exports.AiDifficulty = AiDifficulty;