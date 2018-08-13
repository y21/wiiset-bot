module.exports = message => {
    message.channel.send({
        embed: {
            title: "Super Smash Bros. Brawl information",
            color: message.wiimmfi_api.text.ssbb.online === 0 ? 0xFF0000 : 0x00FF00,
            fields: [{
                name: message.translations.commands.ssbb_total_profiles || "Translation error",
                value: message.wiimmfi_api.text.ssbb.totalProfiles
            },
                {
                    name: message.translations.commands.ssbb_currently_online || "Translation error",
                    value: message.wiimmfi_api.text.ssbb.online
                },
                {
                    name: message.translations.commands.ssbb_last_30m_logins || "Translation error",
                    value: message.wiimmfi_api.text.ssbb.logins.thirty_minutes
                },
                {
                    name: message.translations.commands.ssbb_last_4h_logins || "Translation error",
                    value: message.wiimmfi_api.text.ssbb.logins.four_hours
                },
                {
                    name: message.translations.commands.ssbb_last_24h_logins || "Translation error",
                    value: message.wiimmfi_api.text.ssbb.logins.twentyfour_hours
                }
            ]
        }
    });
};
