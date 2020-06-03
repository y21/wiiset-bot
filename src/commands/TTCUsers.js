const AsciiTable = require("ascii-table");
const { Version } = require("../structures/ttc/Gateway");

module.exports = {
    name: "ttc users",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "Displays top 10 TTC users"
    },
    run: async (context, args, rest) => {
        const users = await rest.ttc.getUsers().then(v => v.slice(0, 9));
        
        const table = new AsciiTable("Leaderboard")
            .removeBorder();

        for (let i = 0; i < users.length; ++i) {
            table.addRow(i + 1, `<@${users[i].id}>`, users[i].rating.toLocaleString());
        }

        return [
            {
                embed: {
                    title: `Leaderboard | TT-Competition ${Version}`,
                    color: 0x2ecc71,
                    description: table.toString()
                }
            }
        ];
    }
};