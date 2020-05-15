const { LobbyOptions, formatLobbyOptions } = require("../rest/TTCRest");

module.exports = {
    name: "ttc createlobby",
    guildOnly: false,
    ownerOnly: true,
    run: async (context, args, rest) => {
        if (args.length < 2)
            throw new Error("no lobby options given, available options: " + Object.keys(LobbyOptions).join(", ") + " (use \",\" as delimiter for more than one option)");

        // Parse options
        const options = args.slice(1)
            .join(" ")
            .split(/, */g)
            .filter(v => LobbyOptions.hasOwnProperty(v))
            .map(v => LobbyOptions[v])
            .reduce((a, b) => a | b);

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
                        },
                        {
                            name: "Lobby Options",
                            value: formatLobbyOptions(lobby.options) || "-"
                        }
                    ]
                }
            }
        ]
    }
};