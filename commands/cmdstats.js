const timediff = date => {
    const timestamp = date.getTime();
    const diff = Date.now() - timestamp;
    let returnValue;

    if (diff < 5000) return "<5s";
    else if (diff < 60000 * 60) return (returnValue = Math.floor(diff / 60000)) + " minute" + (returnValue === 1 ? "" : "s");
    else if (diff < 60000 * 60 * 24) return (returnValue = Math.floor(diff / 3600000)) + " hour" + (returnValue === 1 ? "" : "s");
    else if (diff < 60000 * 60 * 24 * 31) return (returnValue = Math.floor(diff / 86400000)) + " day" + (returnValue === 1 ? "" : "s");
    else if (diff < 60000 * 60 * 24 * 31 * 12) return (returnValue = Math.floor(diff / 2678400000)) + " month" + (returnValue === 1 ? "" : "s");
    else return (returnValue = Math.floor(diff / 31557600000)) + " year" + (returnValue === 1 ? "" : "s");
};


module.exports = class CmdstatsCommand {
    static run(message) {
        message.connection.all("SELECT * FROM commandstats ORDER BY uses DESC LIMIT 20").then(result => {
            message.channel.send("---(Command Statistics)---\n" + result.map(k => {
                let pretext = `${k.name}: ${k.uses} uses`;
                return `${pretext}${" ".repeat(25 - pretext.length)}(used ${k.lastUsage ? timediff(new Date(parseInt(k.lastUsage))) : "never"} ago)`
            }).join("\n"), {code:"hs"});
        });
    }
};
