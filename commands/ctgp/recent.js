const {
    get
} = require("snekfetch");


module.exports = async message => {
    const result = await get("http://tt.chadsoft.co.uk/index.json");
    if (!result.body.startsWith("{")) result.body = result.body.substr(1);
    result.body = JSON.parse(result.body);
    result.body.recentRecords = result.body.recentRecords.slice(0, (parseInt(message.args[1]) || 10));
    message.channel.send({
        embed: {
            title: "CTGP Time Trials - Recent uploaded ghosts",
            fields: result.body.recentRecords.map(val => {
                return {
                    name: val.player || "???",
                    value: "Track: " + val.trackName +
                        "\nTrack version: " + (val.trackVersion || "Default") +
                        "\nTime: `" + val.finishTimeSimple + "`"
                }
            })
        }
    }).catch(console.log);
};