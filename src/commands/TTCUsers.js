const AsciiTable = require("ascii-table");
const { Markup } = require("detritus-client/lib/utils");

module.exports = {
    name: "ttc users",
    guildOnly: false,
    ownerOnly: false,
    run: async (context, args, rest) => {
        const user = await rest.ttc.getUsers();
        if (user.status !== 200) {
            throw new Error(await user.text());
        }

        const data = await user.json();
        const table = new AsciiTable("Leaderboard")
            .removeBorder()
            .setHeading("#", "Player", "Total Rating");

        for (let i = 0; i < data.length; ++i) {
            const username = await context.rest.fetchUser(data[i].userid).then(v => v.username).catch(() => "<unknown>");
            table.addRow(i + 1, username, data[i].total_rating.toLocaleString());
        }

        return [
            {
                embed: {
                    description: Markup.codeblock(table.toString(), { limit: 1990 })
                }
            }
        ];
    }
};