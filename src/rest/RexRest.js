const fetch = require("node-fetch");

class RexRest {
    constructor(host) {
        this.host = host;
    }

    executeCode(language, code) {
        return fetch(this.host + "?LanguageChoice=" + language, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "LanguageChoice": language
            },
            body: JSON.stringify({
                "Program": code,
                "CompilerArgs": "-o a.out source_file.c"
            })
        }).then(v => v.json());
    }

    resolveLanguage(langString) {
        return RexRest.languages[langString];
    }
}
RexRest.languages = require("../../rextesterLanguages");

module.exports = RexRest;
