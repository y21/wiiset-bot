function formatConstantKey(str) {
    let ret = "";

    for (let i = 0; i < str.length; ++i) {
        if (i === 0) ret += str[i];
        else if (str[i] === "_") ret += " ";
        else ret += String.fromCharCode(str[i].charCodeAt() | (1 << 5));
    }

    return ret;
}

module.exports = {
    Regexes: {
        CTGPProfileID: new RegExp("^[A-Z\\d]+$"),
        BOM: new RegExp("^[^{]"),
        Snowflake: new RegExp("^\\d{17,19}$")
    },
    formatConstantKey
};