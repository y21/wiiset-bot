const { execSync } = require("child_process");

module.exports = {
    name: "bash",
    ownerOnly: true,
    guildOnly: false,
    run: async (_, args) => {
        return [ execSync(args.join(" ")).toString() ];
    }
};