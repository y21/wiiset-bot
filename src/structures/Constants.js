module.exports = {
    Regexes: {
        CTGPProfileID: new RegExp("^[A-Z\\d]+$"),
        BOM: new RegExp("^[^{]"),
        Snowflake: new RegExp("^\\d{17,19}$")
    }
};