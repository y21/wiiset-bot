const { stateToString, formatOptions } = require("../structures/ttc/Lobby");

module.exports = {
    name: "ttc lobby",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        const lobby = await rest.ttc.getLobby(args[1]);
        if (lobby.status !== 200) {
            throw new Error(await lobby.text());
        }

        const data = await lobby.json();

        return [{
            embed: {
                color: 0x2ecc71,
                fields: [
                    {
                        name: "ID",
                        value: data.id || "?"
                    },
                    {
                        name: "Creator",
                        value: `<@${data.creator.userid}>`
                    },
                    {
                        name: "Players",
                        value: data.players
                            .sort((a, b) => b.total_rating - a.total_rating)
                            .slice(0, 10)
                            .map(v => `<@${v.userid}> (Rating: ${v.total_rating})`).join("\n") || "-"
                    },
                    {
                        name: "Round",
                        value: data.round || "-"
                    },
                    {
                        name: "Current Track",
                        value: data.currentTrack.name || "-"
                    },
                    {
                        name: "State",
                        value: stateToString(data.state) || "-"
                    },
                    {
                        name: "Options",
                        value: formatOptions(data.options) || "-"
                    }
                ]
            }
        }];
    }
};