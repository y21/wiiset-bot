

module.exports = {
    Regexes: {
        CTGPProfileID: new RegExp("^[A-Z\\d]+$"),
        BOM: new RegExp("^[^{]"),
        Snowflake: new RegExp("^\\d{17,19}$"),
        UserMention: new RegExp("<@!?(\\d{17,19})>"),
        GhostFinishTime: new RegExp("^[0-5]?\\d:[0-5]\\d.\\d{3}$") // 01:23.456
    },
    confirmationReactions: {
        OK: "✅",
        NO: "❌"
    },

    /**
     * @param {string} str
     * @returns {string?}
     */
    resolveUser: function(str, target) {
        if (str.startsWith("<@") && str.endsWith(">")) {
            const match = str.match(/<@!?(\d{17,19})>/);
            if (match) return match[1];
        } else if (!isNaN(str) && str.length >= 17 && str.length <= 19) {
            return str;
        } else if (str === "me") {
            return target;
        }
    },
    /**
     * @param {string} str
     * @returns {string}
     */
    formatConstantKey: function (str) {
        let ret = "";

        for (let i = 0; i < str.length; ++i) {
            if (i === 0) ret += str[i];
            else if (str[i] === "_") ret += " ";
            else ret += String.fromCharCode(str[i].charCodeAt() | (1 << 5));
        }

        return ret;
    }
};