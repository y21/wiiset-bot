const { Version } = require("../structures/ttc/Gateway");

module.exports = {
    name: "ttc help",
    guildOnly: false,
    ownerOnly: false,
    metadata: {
        description: "An introduction to TTC"
    },
    run: async (context, args, rest) => {
        const title = `TT-Competition ${Version}`;
        const color = 0x74b9ff;
        const pages = [{
                // Page 1
                embed: {
                    title,
                    color,
                    description: "TT-Competition is a new gamemode that lets you play Time Trials with friends, players with the same skill-level or really anyone **without** needing to install anything. " +
                        "All you need is CTGP and this Discord bot.\n" +
                        "The idea is you create a \"lobby\", wait until the minimum number of players is reached (3 by default) and submit a ghost on a selected track within a few minutes." +
                        "The bot will then display a table that shows all submitted ghosts.\n" +
                        "This help command will guide you through everything you need to know including creating customised lobbies, joining lobbies, leaving lobbies and more...\n" +
                        "Below this message, you should see reactions (⬅️, ➡️, ...) which lets you navigate through pages. " +
                        "You can also jump to a specific page by reacting with 🔢.\n" +
                        "Note: Always make sure to enable DMs in at least one server this bot shares with you, so it can notify you if a ghost has failed to upload",
                    fields: [{
                        name: "Contents",
                        value: "Page 1: Introduction\n" +
                            "Page 2: Registration\n" +
                            "Page 3: Creating a lobby\n" +
                            "Page 4: Joining and leaving a lobby\n" +
                            "Page 5: Lobby Phases"
                    }]
                },
            },
            {
                // Page 2
                embed: {
                    title,
                    color,
                    description: "The first step is to register your CTGP Profile ID, so the bot can fetch your submitted ghosts. To obtain your PID, follow these steps:\n" +
                        "1.) Head over to the [Profile Search page](http://chadsoft.co.uk/time-trials/players.html)\n" +
                        "2.) Enter your Mii name into the search bar and click on your profile\n" +
                        "3.) Copy your \"Player ID\" and type `w.ttc register <player id>` in any channel",
                    image: {
                        url: "https://i.imgur.com/4QRyQEO.png"
                    }
                }
            },
            {
                // Page 3
                embed: {
                    title,
                    color,
                    description: "After registering your CTGP Profile ID, you can now create a lobby. " +
                        "When creating a lobby, you can specify options to override default behavior, such as Regular Tracks-only instead of All Tracks, 200cc and more!\n" +
                        "You can specify multiple options by seperating them with a `,`.\n" +
                        "By default, lobbies are Elimination-based, meaning that the bot will automatically kick players with the slowest ghost after each round.\n" +
                        "However this can be disabled by using the `NoElimination` lobby option.",
                    fields: [{
                            name: "Valid options",
                            value: "150cc: Use engine class 150cc\n" +
                                "200cc: Use engine class 200cc\n" +
                                "RT: Regular Tracks only\n" +
                                "CT: Custom Tracks only\n" +
                                "AT: All Tracks\n" +
                                "NoElimination: Disable KO mode\n" +
                                "Ranked: Only players with the same rank can join\n" +
                                "Private: Password is required for people to join",
                            inline: true
                        },
                        {
                            name: "Examples",
                            value: "w.ttc create 150cc, RT\n" +
                                "w.ttc create 200cc, NoElimination",
                            inline: true
                        }
                    ]
                }
            },
            {
                // Page 4
                embed: {
                    title,
                    color,
                    description: "To get a list of available lobbies, you can run `w.ttc lobbies`. " +
                        "Just like in this message you will be able to navigate through pages by reacting with `⬅️` and `➡️`.\n" +
                        "To join a lobby, you use `w.ttc join <id>` where `<id>` is a lobby ID that will be shown when a lobby is created or in the `w.ttc lobbies` command. " +
                        "If no lobby ID is provided, a random joinable, public lobby will be chosen.",
                    fields: [{
                        name: "Notes",
                        value: "- If the lobby is private, you will have to pass a generated password as second argument: `w.ttc join <id> <password>`\n" +
                            "- **Only** join a lobby if you are able to play! Leaving very often mid-game without a good reason can end in a temporary ban.\n" +
                            "- You may only join a lobby if it's in the 'waiting' state."
                    }]
                }
            },
            {
                // Page 5
                embed: {
                    title,
                    color,
                    description: "Every lobby has a state tied to it which presents the current phase so the bot can detect what it currently has to do at any time. When the last phase ends and there are no more players, the lobby ends.",
                    fields: [{
                            name: "Waiting",
                            value: "This phase represents the initial state when a lobby is created. More players are required for the lobby to start."
                        },
                        {
                            name: "Threshold Reached",
                            value: "This phase starts when the minimum number of players is reached. It then waits 30 more seconds until the ingame flow starts."
                        },
                        {
                            name: "Picking Map",
                            value: "This phase starts when the counter set in the 'Threshold Reached' phase ends. A map (depending on the lobby options) is now being picked."
                        },
                        {
                            name: "Preparation",
                            value: "This phase gives all players a little bit of time to prepare. It should be enough time for everyone to boot up the game."
                        },
                        {
                            name: "Ingame",
                            value: "This phase represents the main phase. During this state, all players are supposed to drive a ghost on the selected track within 15 minutes and upload it to the ghost database."
                        },
                        {
                            name: "Uploading scores",
                            value: "This phase is the last phase in a lobby flow, in which the bot sorts all submitted ghosts and eliminates the slowest time (unless the 'No Elimination' option is present)."
                        }
                    ]
                }
            }
        ];

        await context.paginator.createReactionPaginator({
            message: context.message,
            pages
        });
    }
};