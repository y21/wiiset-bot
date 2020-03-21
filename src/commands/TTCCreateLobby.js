module.exports = {
    name: "ttc createlobby",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        const data = await rest.ttc.createLobby(context.userId, context.channelId);
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