module.exports = async message => {
    message.channel.send({embed: {
        title: message.translations.commands.ctgp_recent_uploads || "Translation error",
        color: (message.member || { displayColor: 0x00FF00 }).displayColor,
        fields: [
            {
                name: message.translations.commands.ctgp_registered_ghosts || "Translation error",
                value: message.wiimmfi_api.ctgp.recent.uniquePlayers
            },
            {
                name: message.translations.commands.ctgp_leaderboards || "Translation error",
                value: message.wiimmfi_api.ctgp.recent.leaderboardCount
            },
            {
                name: message.translations.commands.ctgp_existing_ghosts || "Translation error",
                value: message.wiimmfi_api.ctgp.recent.ghostCount
            }
        ]
    }}).catch(console.log);
};
