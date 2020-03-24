module.exports = {
    name: "mkwusers",
    ownerOnly: false,
    guildOnly: false,
    run: async (context, __, rest) => {
        const req = await rest.wiimmfi.getMKWUsers(-1);
        const pages = [];

        if (req.length === 0) {
            throw new Error("no rooms found");
        }

        for (let i = 0; i < req.length; i += 10)
            pages.push({
                embed: {
                    description: "```\n" + req.slice(i, i + 10).join("\n") + "\n```"
                }
            });

        context.paginator.createReactionPaginator({
            message: context.message,
            pages
        });
    }
};