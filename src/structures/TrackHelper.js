module.exports = class TrackHelper {
    constructor(rest, tracks) {
        this.rest = rest;
        if (typeof tracks === "undefined")
            this.init();
        else
            this.tracks = tracks;
    }

    async init() {
        this.tracks = await TrackHelper.getTracks();
    }

    static async getTracks() {
        const tracks = {
            original: (await this.rest.getOriginalTracks()).map(v => ({ ...v, category: "original" })),
            custom: (await this.rest.getCustomTracks()).map(v => ({ ...v, category: "custom" }))
        };
        
        return tracks.original.concat(tracks.custom).map(v => ({
            name: v.name,
            id: v.trackId,
            href: v._links.item.href,
            category: v.category
        }));
    }
}