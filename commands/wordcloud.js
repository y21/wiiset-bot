const jimp = require("jimp");

const { Attachment } = require("discord.js");

module.exports = class WordCloudCommand {
    static async run(message) {
        const img = await jimp.read("https://i.imgur.com/N0Ob19w.png");
        await img.resize(1024, 1024);
        const channel = message.mentions.channels.first() || message.channel;
        if (!channel.permissionsFor(message.author).has("VIEW_CHANNEL")) return message.reply("you don't have permissions to view that channel.");
        const font1 = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);
        const font2 = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
        const font3 = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
        const messages = await channel.fetchMessages({limit: 50});
        let words = [];
        for (const msg of messages.values()) {
            for(let word of msg.content.split(" ")) {
                if (!words.some(v => v.s === word)) words.push({s:word, a:1});
                else words.find(v => v.s === word).a++;
            }
        }
        words = words.sort((a,b) => b.a - a.a).slice(0, 50);
        for(let i=0;i<words.length;++i) {
            await img.print(i <= 3 ? font1 : (i <= 5 ? font2 : font3), Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), words[i].s);
        }
        img.getBufferAsync(jimp.MIME_PNG).then(b => {
            message.channel.send(new Attachment(b, "yes.png"));
        });
    }
};
