module.exports = class TrackHelper {
    constructor(tracks) {
        if (typeof tracks === "undefined")
            this.tracks = TrackHelper.getTracks();
        else
            this.tracks = tracks;
    }

    static getTracks() {
        
    }
}