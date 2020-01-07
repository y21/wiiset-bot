module.exports = {
    name: "tag",
    ownerOnly: false,
    guildOnly: false,
    run: (context, args) => {
        return new Promise((resolve, reject) => {
            context.pool.query("SELECT content FROM tags WHERE name = $1",
                [args[0]],
                (_, res) => {
                    if (res.rowCount === 0) {
                        reject(["Tag not found..."]);
                    } else {
                        resolve([{
                            embed: {
                                description: res.rows[0].content
                            }
                        }]);
                    }
                });
        });
    }
};