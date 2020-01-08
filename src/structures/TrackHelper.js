module.exports = class TrackHelper {
    constructor(rest, tracks) {
        this.rest = rest;
        if (typeof tracks === "undefined")
            this.init();
        else
            this.tracks = tracks;
    }

    async init() {
        this.tracks = await TrackHelper.getTracks(this.rest);
    }

    static async getTracks(rest) {
        const tracks = {
            original: (await rest.getOriginalTracks()).leaderboards.map(v => ({ ...v, category: "original" })),
            custom: (await rest.getCustomTracks()).leaderboards.map(v => ({ ...v, category: "custom" }))
        };
        
        return tracks.original.concat(tracks.custom).map(v => ({
            name: v.name,
            id: v.trackId,
            href: v._links.item.href,
            category: v.category
        }));
    }
};