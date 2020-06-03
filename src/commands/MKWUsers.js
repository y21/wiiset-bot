const { Markup } = require("detritus-client/lib/utils");
const AsciiTable = require("ascii-table");

module.exports = {
    name: "mkwusers",
    ownerOnly: false,
    guildOnly: false,
    run: async (context, args, rest) => {
        const req = await rest.wiimmfi.getMKWUsers(args[0] || undefined, -1);
        const pages = [];

        if (req.length === 0) {
            throw new Error("no rooms found");
        }

        for (let i = 0; i < req.length; i += 10) {
            const table = new AsciiTable()
                .removeBorder()
                .setHeading("Player", "", "VR");

            for (const player of req.slice(i, i + 10)) {
                const miiName = (player.names || ["<unknown>"])[0];
                const vr = player.ev === -1 ? "-" : player.ev;
                table.addRow(miiName, "", vr);
            }

            pages.push({
                embed: {
                    description: Markup.codeblock(table.toString(), {
                        language: "js",
                        limit: 1990
                    })
                }
            });
        }

        context.paginator.createReactionPaginator({
            message: context.message,
            pages
        });
    }
};