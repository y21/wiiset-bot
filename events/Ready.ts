import Base from "../Base";
import Event from "../structures/EventData";
import fetch from "node-fetch";

export default <Event>{
    type: "ready",
    run: async (base: Base): Promise<any> => {
        console.log(`Connected to Discord (${base.client.guilds.size} Servers & ${base.client.users.size} Users)`);

        Base.owner = base.client.users.get("312715611413413889") || await base.client.fetchUser("312715611413413889");

        let tracks: any = {
            originalTracks: await fetch("http://tt.chadsoft.co.uk/original-track-leaderboards.json").then(v => v.text()).then(v => v.replace(/^\s*/, "")),
            customTracks: await fetch("http://tt.chadsoft.co.uk/ctgp-leaderboards.json").then(v => v.text()).then(v => v.replace(/^\s*/, ""))
        };

        for (const category in tracks) {
            for (const track of JSON.parse(tracks[category]).leaderboards) {
                if (!base.tracks.some((v: any) => v.name === track.name)) {
                    base.tracks.push({
                        name: track.name,
                        id: track.trackId,
                        href: track._links.item.href,
                        category
                    });
                }
            }
        }
    }
}