const { stateToString, formatOptions } = require("../structures/ttc/Lobby");

module.exports = {
    name: "ttc lobby",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "Displays lobby information"
    },
    run: async (context, args, rest) => {
        const lobby = await rest.ttc.getLobby(args[0]);

        return [{
            embed: {
                color: 0x2ecc71,
                fields: [
                    {
                        name: "ID",
                        value: lobby.id || "?"
                    },
                    {
                        name: "Creator",
                        value: `<@${lobby.creator.id}>`
                    },
                    {
                        name: "Players",
                        value: lobby.players
                            .sort((a, b) => b.rating - a.rating)
                            .slice(0, 10)
                            .map(v => `<@${v.id}> (Rating: ${v.rating})`).join("\n") || "-"
                    },
                    {
                        name: "Round",
                        value: lobby.round || "-"
                    },
                    {
                        name: "Current Track",
                        value: (lobby.currentTrack || {}).name || "-"
                    },
                    {
                        name: "State",
                        value: stateToString(lobby.state) || "-"
                    },
                    {
                        name: "Options",
                        value: formatOptions(lobby.options) || "-"
                    }
                ]
            }
        }];
    }
};