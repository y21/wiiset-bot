const fetch = require("node-fetch");
const languages = require("../../rextesterLanguages");
const { rexAPI } = require("../../configs/apis");

module.exports = {
    name: "rex",
    ownerOnly: false,
    guildOnly: false,
    run: async (_, args) => {
        if (!languages[args[0]]) throw new Error("Language not found!");
        const lang = languages[args[0]];
        const request = await fetch(rexAPI + "?LanguageChoice=" + lang, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "LanguageChoice": lang
            },
            body: JSON.stringify({
                "Program": args.slice(1).join(" ").replace(/```\w*/g, "")
            })
        }).then(v => v.json());

        return ["```js\n" + (request.Errors || request.Result).substr(0, 1980) + "\n```"];
    }
};