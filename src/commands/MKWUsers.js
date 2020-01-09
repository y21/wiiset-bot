module.exports = {
    name: "mkwusers",
    ownerOnly: false,
    guildOnly: false,
    run: async (_, __, rest) => {
        const req = await rest.wiimmfi.getMKWUsers();
        return [{
            embed: {
                title: "Players in rooms",
                description: "```hs\n" + req.join("\n") + "\n```"
            }
        }];
    }
};