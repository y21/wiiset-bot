module.exports = {
    error: (text) => console.log("\x1b[31m%s\x1b[0m", text),
    info: (text) => console.log("\x1b[34m%s\x1b[0m", text)
};