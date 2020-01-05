const TagRegex = new RegExp("^[\\w\\-]{1,16}$");

module.exports = {
    name: "createtag",
    ownerOnly: false,
    guildOnly: false,
    run: (context, args) => {
        return new Promise((resolve, reject) => {
            if (!TagRegex.test(args[0])) throw new Error("Invalid tag name");
            context.pool.query("INSERT INTO tags (\"name\", \"author\", \"content\", \"createdAt\", \"uses\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING",
                [args[0], context.userId, args.slice(1).join(" "), Date.now().toString(), 0],
                (_, res) => {
                    if (res.rowCount === 0) {
                        reject(["⚠️ `Tag exists already...`"]);
                    } else {
                        resolve(["✅ Tag created"])
                    }
                });
        });
    }
};