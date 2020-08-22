import CTGP, {Types} from 'ctgp-rest';

type TracksMap = Map<string, Types.Responses.Leaderboard>;

export class TrackHelper {
    public tracks: TracksMap;

    constructor() {
        this.tracks = new Map;
    }

    public async init(): Promise<TracksMap> {
        const tracks = await Promise.all([
            CTGP.getOriginalTracks(),
            CTGP.getCustomTracks()
        ]).then(x => x.map(y => y.leaderboards).flat());

        for (const track of tracks) {
            this.tracks.set(track.name.toLowerCase(), track);
        }

        return this.tracks;
    }

    public findTrack(_name: string, allowSlowSearch = true): Types.Responses.Leaderboard | undefined {
        const name = _name.toLowerCase();
        
        let track = this.tracks.get(name);
        if (!track && allowSlowSearch) {
            
            // Slow and defeats the point of a map, but we want to allow mapping like 'luigi cir' -> 'luigi circuit'
            track = Array.from(this.tracks.entries()).find(([k]) => k.includes(name))?.[1];
        }

        return track;
    }
}