const { rexAPI } = require("../../configs/apis");
const fetch = require("node-fetch");

class RexRest {
    executeCode(language, code) {
        return fetch(rexAPI + "?LanguageChoice=" + language, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "LanguageChoice": language
            },
            body: JSON.stringify({
                "Program": code
            })
        }).then(v => v.json());
    }

    resolveLanguage(langString) {
        return RexRest.languages[langString];
    }
};
RexRest.languages = require("../../rextesterLanguages");

module.exports = RexRest;