module.exports = {
    name: "ttc lobbies",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        const lobbies = await rest.ttc.getLobbies();
        if (lobbies.status !== 200) {
            throw new Error(await lobbies.text());
        }

        const data = await lobbies.json();

        // TODO: Use paginator to allow more than 10 lobbies

        return [{
            embed: {
                color: 0x2ecc71,
                fields: data.slice(0, 10).map(v => ({
                    name: v.id,
                    value: "Players: " + v.players.length
                })),
                footer: {
                    text: "Join a lobby using w.ttc join <id>"
                }
            }
        }];
    }
};