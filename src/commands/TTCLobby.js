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
                        name: "Round",
                        value: data.round
                    },
                    {
                        name: "Current Track",
                        value: data.currentTrack.name || "-"
                    }
                ]
            }
        }];
    }
};