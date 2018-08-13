module.exports = async message => {
    let copy = message.wiimmfi_api.ctgp.recent;
    copy.recentRecords = copy.recentRecords.slice(0, (parseInt(message.args[1]) || 10));
    message.channel.send({
        embed: {
            title: message.translations.commands.ctgp_recent_uploads || "Translation error",
            fields: copy.recentRecords.map(val => {
                return {
                    name: val.player || "???",
                    value: "Track: " + val.trackName +
                        "\nTrack version: " + (val.trackVersion || "Default") +
                        "\nTime: `" + val.finishTimeSimple + "`"
                }
            }),
            color: (message.member || { displayColor: 0x00FF00 }).displayColor
        }
    }).catch(console.log);
};
