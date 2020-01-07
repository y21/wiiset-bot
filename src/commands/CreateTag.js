const TagRegex = new RegExp("^[\\w\\-]{1,16}$");

module.exports = {
    name: "createtag",
    ownerOnly: false,
    guildOnly: false,
    run: async (context, args) => {
        if (!TagRegex.test(args[0])) throw new Error("Invalid tag name");
        const res = await context.db.query("INSERT INTO tags (\"name\", \"author\", \"content\", \"createdAt\", \"uses\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING",
        [
            args[0],
            context.userId,
            args.slice(1).join(" "),
            Date.now().toString(),
            0
        ]);

        if (res.rowCount === 0) {
            throw new Error("Tag already exists...");
        } else {
            return ["✅ Tag created"];
        }
    }
};