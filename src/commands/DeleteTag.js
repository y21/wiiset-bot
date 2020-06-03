module.exports = {
    name: "deletetag",
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Deletes a tag"
    },
    run: async (context, args) => {
        const res = await context.db.query("DELETE FROM tags WHERE author = $1 AND name = $2",
            [
                context.userId,
                args[0]
            ]);

        if (res.rowCount === 0) {
            throw new Error("Tag not found...");
        } else {
            return ["✅ Tag deleted"];
        }
    }
};