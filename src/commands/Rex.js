const languages = require("../../rextesterLanguages");

module.exports = {
    name: "rex",
    ownerOnly: false,
    guildOnly: false,
    run: async (_, args, rest) => {
        if (!languages[args[0]]) throw new Error("Language not found!");
        const lang = rest.rex.resolveLanguage(args[0]);
        const res = await rest.rex.executeCode(lang, args.slice(1).join(" ").replace(/```\w* /g, ""));

        return ["```js\n" + (res.Errors || res.Result).substr(0, 1980) + "\n```"];
    }
};