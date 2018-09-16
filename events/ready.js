module.exports = async data => {
    let { client, utils, wiimmfi_api, tracks, fetch } = data;
    console.log(`[${new Date().toLocaleString()}] Bot is ready (${client.guilds.size} Servers and ${client.users.size} Users.)`);

    return new Promise(async a => {
        // Getting data from Wiimmfi API
        wiimmfi_api = await utils.updateData(fetch);
        await utils.updatePresence(wiimmfi_api, client);

        // Course initialization
        let course = {
            original: JSON.parse((await (await fetch("http://tt.chadsoft.co.uk/original-track-leaderboards.json")).text()).replace(/^\s*/, "")),
            cts: JSON.parse((await (await fetch("http://tt.chadsoft.co.uk/ctgp-leaderboards.json")).text()).replace(/^\s*/, ""))
        };

        for(const category of Object.entries(course)) {
            for(const track of category[1].leaderboards) {
                if(!tracks.find(val => val.name === track.name)) {
                    tracks.push({
                        name: track.name,
                        id: track.trackId,
                        href: track._links.item.href
                    });
                }
            }
        }
        a({
            tracks, wiimmfi_api
        });
    });
};