const chalk = require("chalk");

module.exports = {
    error: (text) => {
        console.log(chalk.red(text));
    },
    info: (text) => {
        console.log(chalk.blueBright(text));
    }
}