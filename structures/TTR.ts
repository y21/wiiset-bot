import Base from "../Base";
import * as TTRMatch from "./TTRMatch";
import {Profile} from "./TTRProfile";
import {Channel, DMChannel, TextChannel} from "discord.js";

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
            match = <TTRMatch.Match>this.base.ongoingMatches.find(v => v.id === matchID);
        else match = matchID;

        if (match.state === TTRMatch.State.ENDED) {
            return;
        } else if (match.state === TTRMatch.State.WAITING) {
            const players = await this.base.sqlite.all("SELECT * FROM ttrProfiles WHERE currentLobby=?", match.id);
            if (players.length >= 2) {
                this.base.sqlite.run("UPDATE ttrMatches SET state=? WHERE id=?", match.state = TTRMatch.State.COURSE_SELECTION);
            }
        } else if (match.state === TTRMatch.State.COURSE_SELECTION) {
            const track = this.generateTrack(match.options);
            const profiles: Profile[] = await this.base.sqlite.all("SELECT channel, user FROM ttrProfiles WHERE currentLobby = ?", match.id);
            match.course = track.name;
            this.base.sqlite.run("UPDATE ttrMatches SET state=? WHERE id=?", match.state = TTRMatch.State.INGAME, match.id);
            match.startedAt = Date.now().toString();
            match.givenTime = 660000;
            for (const profile of profiles) {
                const channel: Channel | undefined = this.base.client.channels.get(profile.channel || "0");
                if (channel && channel instanceof TextChannel) {
                    channel.send(profile.user.toString() + " Track: " + track.name + "\n- Play in Time Trials (150cc, no shortcut)\n- Try to get the fastest time\n- After finishing a ghost, upload it onto the ghost database and type `" + this.base.config.prefix + "ttr submit`\n- Time: 11 Minutes");
                }
            }
        } else if (match.state === TTRMatch.State.INGAME) {
            if (match.givenTime) {
                if (Date.now() >= Number(match.startedAt) + match.givenTime) {
                    this.base.sqlite.run("UPDATE ttrMatches SET state=? WHERE id=?",match.state = TTRMatch.State.CHECK_TIME, match.id);
                }
            }
        } else if (match.state === TTRMatch.State.CHECK_TIME) {
            const profiles: Profile[] = await this.base.sqlite.all("SELECT user, submittedTime, channel FROM ttrProfiles WHERE currentLobby = ? ORDER BY submittedTime");
            const eliminated: Profile[] = profiles.concat(profiles.filter(v => !v.submittedTime)).slice(profiles.length - 3 >= 1 ? -3 : 1);
            for (const profile of eliminated) {
                const channel: Channel | undefined = this.base.client.channels.get(profile.channel || "0");
                if (channel && channel instanceof TextChannel) {
                    channel.send(profile.user.toString() + " you have been eliminated due to your time being the slowest.");
                }
                // TODO: properly calculate gain/loss
                this.base.sqlite.run("UPDATE ttrProfiles SET currentLobby=null, channel=null, rating=rating-10, submittedTime=null WHERE user=?", profile.user);
            }
            if (profiles.length - eliminated.length <= 1) {
                const winner: Profile | undefined = profiles.find(v => !eliminated.some(v2 => v2.user === v.user));
                if (winner) {
                    this.base.sqlite.run("UPDATE ttrProfiles SET currentLobby=null, channel=null, rating=rating+10, submittedTime=null WHERE user=?", winner.user);
                    const winnerChannel: Channel | undefined = this.base.client.channels.get(winner.channel || "0");
                    if (winnerChannel && winnerChannel instanceof TextChannel) {
                        winnerChannel.send("You won this match. +10");
                    }
                }
            } else this.base.sqlite.run("UPDATE ttrMatches SET state=? WHERE id=?", match.state = TTRMatch.State.COURSE_SELECTION, match.id);
        }
    }

    generateTrack(options: number): any {
        let tracks: any[];
        if (options === TTRMatch.MatchOptions.RTs)
            tracks = this.base.tracks.filter((v: {category: string}) => v.category === "originalTracks");
        else if (options === TTRMatch.MatchOptions.CTs)
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