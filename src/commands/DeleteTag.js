module.exports = {
    name: "deletetag",
    ownerOnly: false,
    guildOnly: false,
    run: (context, args) => {
        return new Promise((resolve, reject) => {
            context.pool.query("DELETE FROM tags WHERE author = $1 AND name = $2",
                [context.userId, args[0]],
                (_, res) => {
                    if (res.rowCount === 0) {
                        reject(["Tag not found..."]);
                    } else {
                        resolve(["✅ Tag deleted"]);
                    }
                });
        });
    }
};