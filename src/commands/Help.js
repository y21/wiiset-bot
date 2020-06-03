const { supportServer } = require("../../configs/bot");

module.exports = {
    name: "help",
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Lists all commands"
    },
    run: async (context) => {
        const pages = [{
            embed: {
                title: "Help",
                description: "This bot uses the Ghost Database API for CTGP commands and other external APIs for stuff like the cat command.\n" +
                "The code might have some bugs as there was a rewrite going on over the past few weeks. If you find one, please report it.\n" +
                "This help page will only work for the next 180 seconds (3 minutes).",
                fields: [
                    {
                        name: "Related links",
                        value: `Join our [support server](${supportServer}) for questions.\n` +
                            `[Invite](https://discordapp.com/oauth2/authorize?client_id=${context.client.user.id}&scope=bot) the bot to your server`
                    }
                ]
            }
        }];

        for (let i = 0; i < context.commandClient.commands.length; i += 5) {
            pages.push({
                embed: {
                    title: "Help",
                    fields: context.commandClient.commands
                        .slice(i, i + 5)
                        .map((v) => ({ 
                            name: context.commandClient.prefixes.custom.first() + v.name,
                            value: v.metadata.description || "-"
                        }))
                }
            });
        }

        context.paginator.createReactionPaginator({
            message: context.message,
            pages
        });
    }
};