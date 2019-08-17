module.exports = class WordCommand {
    static async run(message) {
        const channel = message.channel;
        const messages = channel.messages;
        let words = [];
        for (const msg of messages.values()) {
            for(let word of msg.content.split(" ")) {
                if (msg.author.bot) continue;
                if (!words.some(v => v.s === word)) words.push({s:word, a:1});
                else words.find(v => v.s === word).a++;
            }
        }
        words = words.filter(v => !v.s.startsWith("w.")).map(v=>v.s.replace(/<@[&!]?(\d{15,22})>/g, "<@‍$1>"));
        message.channel.send(words[Math.floor(Math.random() * words.length)]);
    }
};

