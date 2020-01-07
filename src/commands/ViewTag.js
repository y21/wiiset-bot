module.exports = {
    name: "tag",
    ownerOnly: false,
    guildOnly: false,
    run: async (context, args) => {
        const res = await context.db.query("SELECT content FROM tags WHERE name = $1", [args[0]]);
        await context.db.query("UPDATE tags SET uses = uses + 1 WHERE name = $1", [args[0]]);

        if (res.rowCount === 0) {
            throw new Error("Tag not found...");
        } else {
            return [{
                embed: {
                    description: res.rows[0].content
                }
            }];
        }
    }
};