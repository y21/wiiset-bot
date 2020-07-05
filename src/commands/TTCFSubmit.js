const { Regexes, resolveUser, confirmationReactions } = require("../structures/Constants");

module.exports = {
    name: "ttc fsubmit",
    guildOnly: true,
    ownerOnly: false,
    metadata: {
        description: "Force submit a ghost (can only be used by lobby creators)",
        examples: [
            "w.ttc fsubmit @user 01:23.456"
        ]
    },
    run: async function (context, args, rest) {
        if (args.length < 2) throw new Error(`Missing arguments! Example usage: ${this.metadata.examples[0]}`);

        const [user, time] = args;

        if (!Regexes.GhostFinishTime.test(time)) throw new Error(`Invalid ghost time format! Example usage: ${this.metadata.examples[0]}`);

        const userId = resolveUser(user, context.userId);
        if (!userId) throw new Error(`Invalid user! Example usage: ${this.metadata.examples[0]}`);

        const commandMessage = await context.reply({
            content: `<@${userId}>`,
            embed: {
                description: "Do you really want to force-submit this time? Please double check if the given time matches your ghost!\n\n**" + time + "**",
                footer: {
                    text: "Note: To prevent players from cheating, submitting a wrong time leads to a temporary TTC ban"
                }
            }
        });

        const paginator = await context.paginator.createReactionPaginator({
            message: context.message,
            reactions: {
                OK: confirmationReactions.OK,
                NO: confirmationReactions.NO
            },
            commandMessage,
            targetUser: userId
        });

        paginator.on("raw", async (data) => {
            const { emoji } = data;

            switch (emoji.name) {
                case confirmationReactions.OK:
                    await rest.ttc.forceSubmitGhost(userId, context.userId, time, args.slice(2).join(" "));
                    await commandMessage.edit({
                        content: "Successfully submitted time!",
                        embed: null
                    });
                    break;
                case confirmationReactions.NO:
                    await commandMessage.edit({
                        content: "Aborted.",
                        embed: null
                    });
                    break;
                default:
                    return;
            }

            paginator.stop();
        });
    }
};