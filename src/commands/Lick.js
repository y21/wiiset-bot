module.exports = {
    name: "lick",
    ownerOnly: false,
    guildOnly: false,
    run: async (context) => {
        const { mentions } = context.message;
        if (mentions.size === 0) reject(["User not found"]);
        const licks = await context.db.query("SELECT amount FROM licks WHERE author = $1",
            [
                mentions.first().id
            ]);

        let amount;
        if (licks.rowCount === 0) {
            await context.db.query("INSERT INTO licks (\"author\", \"amount\") VALUES ($1, 1)", [mentions.first().id]);
            amount = 1;
        } else {
            await context.db.query("UPDATE licks SET amount = amount + 1 WHERE author = $1", [mentions.first().id]);
            amount = licks.rows[0].amount + 1;
        }

        return [{
            embed: {
                color: 0x77b254,
                description: "Lick User",
                fields: [{
                    name: "Total licks",
                    value: `${amount} licks`
                }]
            }
        }];
    }
};