module.exports = {
    name: "tags",
    ownerOnly: false,
    guildOnly: false,
    run: (context) => {
        return new Promise((resolve) => {
            context.pool.query("SELECT name, uses FROM tags ORDER BY uses DESC LIMIT 10",
                (_, {rows}) => {
                    resolve([{
                        embed: {
                            title: "Tag List",
                            description: rows.map((k, i) => `${i + 1}. ${k.name} (used ${k.uses} times)`).join("\n")
                        }
                    }]);
                });
        });
    }
};