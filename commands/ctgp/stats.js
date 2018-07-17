module.exports = async message => {
    message.channel.send({embed: {
        title: "General statistics about the ghost database",
        color: (message.member || { displayColor: 0x00FF00 }).displayColor,
        fields: [
            {
                name: "Registered users in ghost database",
                value: message.wiimmfi_api.ctgp.recent.uniquePlayers
            },
            {
                name: "Leaderboards",
                value: message.wiimmfi_api.ctgp.recent.leaderboardCount
            },
            {
                name: "Existing ghosts in database",
                value: message.wiimmfi_api.ctgp.recent.ghostCount
            }
        ]
    }}).catch(console.log);
};