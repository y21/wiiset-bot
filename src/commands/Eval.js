const { inspect } = require("util");

module.exports = {
    name: "eval",
    ownerOnly: true,
    guildOnly: false,
    run: async (context, args, rest) => { // eslint-disable-line no-unused-vars
        let res;
        try {
            res = await eval(args.join(" "));
        } catch(e) {
            res = e.message;
        }

        return ["```js\n" + inspect(res).substr(0, 1980) + "\n```"];
    }
};