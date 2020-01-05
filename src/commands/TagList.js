module.exports = {
    name: "tags",
    ownerOnly: false,
    guildOnly: false,
    run: (context) => {
        return new Promise((resolve) => {
            context.pool.query("SELECT name FROM tags LIMIT 10",
                (_, {rows}) => {
                    resolve([{
                        embed: {
                            title: "Tag List",
                            description: rows.map((k, i) => `${i}. ${k.name}`).join("\n")
                        }
                    }]);
                });
        });
    }
};