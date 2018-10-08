const nodefetch = require("node-fetch");


module.exports = class LookupCommand {
	static async run(message) {
        try {
            if (message.args.length === 0) return message.reply("no game provided.");
            if (!/^[a-z0-9\.\,\- ]+$/i.test(message.args.join(" "))) return message.reply("invalid format.");
            let request = await nodefetch(`https://www.nintendo.com/json/content/get/filter/game?system=wii&search=${message.args.join("%20")}&limit=1`);
            let json = await request.json();
            if (json.games.game === undefined) return message.reply("Game not found.");
            message.channel.send({embed: {
                    title: json.games.game.title,
                    thumbnail: {
                        url: json.games.game.front_box_art
                    },
                    fields: [
                        {
                            name: "Platform",
                            value: json.games.game.system
                        },
                        {
                            name: "Game code",
                            value: json.games.game.game_code
                        },
                        {
                            name: "Category",
                            value: (json.games.game.categories.category || { constructor: { name: "Object" } }).constructor.name === "Array" ?
                                json.games.game.categories.category.join(", ") :
                                (json.games.game.categories.category || "-")
                        },
                        {
                            name: "Release date",
                            value: json.games.game.release_date
                        },
                        {
                            name: "Number of players",
                            value: json.games.game.number_of_players[0].toUpperCase() + json.games.game.number_of_players.substr(1)
                        }
                    ]
                }}).catch(() => {
                message.reply("An error occured while sending the embed.");
            });
        } catch(e) {
            console.log(e);
            message.reply("An error occured while sending the embed.");
        }
	}
};