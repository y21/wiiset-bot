import Base from "../Base";
import * as TTRMatch from "./TTRMatch";
import {Profile} from "./TTRProfile";

export default class TTR {
    public base: Base;
    constructor(base: Base) {
        this.base = base;
    }

    getMatch(id: string): TTRMatch.Match | undefined {
        return this.base.sqlite.get("SELECT * FROM ttrMatches WHERE id = ?", id);
    }

    async handle(matchID: string | TTRMatch.Match): Promise<any> {
        let match: TTRMatch.Match;
        if (typeof matchID === "string")
            match = <TTRMatch.Match>(await this.getMatch(matchID));
        else match = matchID;

        switch(match.state) {
            case TTRMatch.State.ENDED:
                return;
            case TTRMatch.State.WAITING:
                if (match.participants.split(",").length >= 20) {
                    match.state = TTRMatch.State.COURSE_SELECTION;

                }
                break;
            case TTRMatch.State.COURSE_SELECTION:
                const track = this.generateTrack(match.options);
                match.course = track.name;
                match.state = TTRMatch.State.INGAME;
                match.startedAt = Date.now().toString();
                match.givenTime = 660000;
                break;
            case TTRMatch.State.INGAME:
                if (match.givenTime) {
                    if (Date.now() >= Number(match.startedAt) + match.givenTime) {
                        match.state = TTRMatch.State.CHECK_TIME;
                    }
                }
                break;
            case TTRMatch.State.CHECK_TIME:
                const profiles: Profile[] = await this.base.sqlite.all("SELECT user, submittedTime FROM ttrProfiles WHERE currentLobby = ? ORDER BY submittedTime");

                break;
        }
        this.handle(match);
    }

    generateTrack(options: number): any {
        let tracks: any[];
        if (options === TTRMatch.MatchOptions.CTs)
            tracks = this.base.tracks.filter((v: {category: string}) => v.category === "originalTrack");
        else if (options === TTRMatch.MatchOptions.RTs)
            tracks = this.base.tracks.filter((v: {category: string}) => v.category === "customTracks");
        else throw new Error("Unknown option");

        return tracks[Math.floor(Math.random() * tracks.length)];
    }

    static textToTime(time: string): number {
        const args: string[] = time.split(/[:.]/);
        const min: number = Number(args[0]);
        const sec: number = Number(args[1]);
        const ms: number = Number(args[2]);
        return ms + (sec * 1000) + (min * 60000);
    }
}