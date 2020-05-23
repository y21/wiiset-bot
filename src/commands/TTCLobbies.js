const { stateToString } = require("../structures/ttc/Lobby");
const { TierToString, GetTier } = require("../structures/ttc/Tier");

module.exports = {
    name: "ttc lobbies",
    guildOnly: false,
    ownerOnly: true,
    run: async (context, args, rest) => {
        const lobbies = await rest.ttc.getLobbies();
        if (lobbies.status !== 200) {
            throw new Error(await lobbies.text());
        }

        const data = await lobbies.json().then(v => v.sort((a, b) => b.players - a.players).slice(0, 10));


        return [{
            embed: {
                color: 0x2ecc71,
                fields: data.slice(0, 10).map(v => ({
                    name: v.id,
                    value: `State: ${stateToString(v.state)}\nPlayers: ${v.players.length} | Round: ${v.round}\nTier: ${TierToString(GetTier(v.creator.total_rating))}`
                })),
                footer: {
                    text: "w.ttc join <id> | w.ttc lobby <id>"
                }
            }
        }];
    }
};