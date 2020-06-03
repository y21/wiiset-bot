module.exports = {
    name: "ssbb",
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Displays Super Smash Bros Brawl statistics"
    },
    run: async (_, __, rest) => {
        const res = await rest.wiimmfi.getSSBBStats();
        return [{
            embed: {
                title: "Super Smash Bros. Brawl information",
                color: res.online === 0 ? 0xFF0000 : 0x00FF00,
                fields: [
                    {
                        name: "Total profiles",
                        value: res.totalProfiles || 0
                    },
                    {
                        name: "Currently online",
                        value: res.online || 0
                    },
                    {
                        name: "Logins in the past 30 minutes",
                        value: res.logins.thirty_minutes || 0
                    },
                    {
                        name: "Logins in the past 4 hours",
                        value: res.logins.four_hours || 0
                    },
                    {
                        name: "Logins in the past 24 hours",
                        value: res.logins.twentyfour_hours || 0
                    }
                ]
            }
        }];
    }
};