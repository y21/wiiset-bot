module.exports = message => {
    message.channel.send({
        embed: {
            title: "Super Smash Bros. Brawl information",
            color: message.wiimmfi_api.text.ssbb.online === 0 ? 0xFF0000 : 0x00FF00,
            fields: [{
                name: "Total profiles",
                value: message.wiimmfi_api.text.ssbb.totalProfiles
            },
                {
                    name: "Currently online",
                    value: message.wiimmfi_api.text.ssbb.online
                },
                {
                    name: "Logins in the last 30 minutes",
                    value: message.wiimmfi_api.text.ssbb.logins.thirty_minutes
                },
                {
                    name: "Logins in the last four hours",
                    value: message.wiimmfi_api.text.ssbb.logins.four_hours
                },
                {
                    name: "Logins in the last 24 hours",
                    value: message.wiimmfi_api.text.ssbb.logins.twentyfour_hours
                }
            ]
        }
    });
};
