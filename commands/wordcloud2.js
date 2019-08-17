module.exports = class WordCloud2Command {
    static async run(message) {
        const channel = message.channel;
        const messages = channel.messages;
        const wordCount = parseInt(message.args[0]) || 100;
        let words = [];
        for (const msg of messages.values()) {
            for(let word of msg.content.split(" ")) {
                if (msg.author.bot) continue;
                if (!words.some(v => v.s === word)) words.push({s:word, a:1});
                else words.find(v => v.s === word).a++;
            }
        }
        words = words.sort((a,b) => b.a - a.a).slice(0, wordCount).map(v=>v.s.replace(/<@[&!]?(\d{15,22})>/g, "<@‍$1>"));
        message.channel.send(words.join(" ").substr(0,1990), {
            code: ""
        });
    }
};
