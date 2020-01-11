const { Regexes } = require("../structures/Constants");

module.exports = {
    name: "setpid",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args) => {
        const query = await context.db.query("SELECT pid FROM pids WHERE author = $1", [context.userId]);
        if (args.length === 0) {
            if (query.rowCount === 0) {
                throw new Error("No Profile ID found under your account.");
            } else {
                return ["Your profile ID: `" + query.rows[0].pid + "`."];
            }
        } else if (!Regexes.CTGPProfileID.test(args[0])) {
            throw new Error("Invalid Profile ID specified");
        } else {
            if (query.rowCount === 0) {
                await context.db.query("INSERT INTO pids (author, pid) VALUES ($1, $2)", [context.userId, args[0]]);
            } else {
                await context.db.query("UPDATE pids SET pid = $1 WHERE author = $2", [args[0], context.userId]);
            }
            return ["Profile ID updated."];
        }
    }
};