module.exports = {
    name: "tags",
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Lists global tags"
    },
    run: async (context) => {
        const res = await context.db.query("SELECT name, uses FROM tags ORDER BY uses DESC LIMIT 10");
        return [{
            embed: {
                title: "Tag List",
                description: res.rows.map((k, i) => `${i + 1}. ${k.name} (used ${k.uses} times)`).join("\n")
            }
        }];
    }
};