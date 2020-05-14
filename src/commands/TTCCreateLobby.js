const { LobbyOptions } = require("../rest/TTCRest");

module.exports = {
    name: "ttc createlobby",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        // Parse options
        const options = args.slice(1)
            .join(" ")
            .split(/, */g)
            .filter(v => LobbyOptions.hasOwnProperty(v))
            .map(v => LobbyOptions[v])
            .reduce((a, b) => a | b) || 0;

        const data = await rest.ttc.createLobby(context.userId, context.channelId, options);
        if (data.status !== 200) {
            throw new Error(await data.text());
        }

        const lobby = await data.json();

        return [
            {
                embed: {
                    color: 0x2ecc71,
                    description: "Successfully created lobby!",
                    fields: [
                        {
                            name: "Lobby ID",
                            value: lobby.id
                        }
                    ]
                }
            }
        ]
    }
};