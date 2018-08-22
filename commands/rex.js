const fetch = require("node-fetch"),
    FormData = require("form-data")

module.exports = message => {
    // Because of Discord formatting ...
    message.args = message.args.join(" ").split(/\s+/);
    let languages = {
        "cs": 1,
        "vb": 2,
        "f#": 3,
        "java": 4,
        "python": 5,
        "py": 5,
        "c": 6,
        "cpp": 7,
        "c++": 7,
        "php": 8,
        "pascal": 9,
        "objective-c": 10,
        "oc": 10,
        "haskell": 11,
        "hs": 11,
        "ruby": 12,
        "perl": 13,
        "lua": 14,
        "asm": 15,
        "assembly": 15,
        "sql": 16,
        "js": 17,
        "lisp": 18,
        "prolog": 19,
        "go": 20,
        "scala": 21,
        "scheme": 22,
        "nodejs": 23,
        "node": 23,
        "octave": 25,
        "d": 30,
        "r": 31,
        "tcl": 32,
        "mysql": 33,
        "postgres": 34,
        "oracle": 35,
        "swift": 37,
        "bash": 38,
        "ada": 39,
        "erlang": 40,
        "elixir": 41,
        "ocaml": 42,
        "kotlin": 43,
        "brainfuck": 44,
        "fortran": 45
    };
    if(typeof languages[message.args[0]] === "undefined") return message.reply("Invalid language.");
    const form = new FormData();
    form.append("LanguageChoice", languages[message.args[0]]);
    form.append("Program", message.args.slice(1).join(" ").replace(/```\w*/g, " "));
    if (languages[message.args[0]] === 7) form.append("CompilerArgs", "-o a.out source_file.cpp");
    fetch("http://rextester.com/rundotnet/api", {
        method: "POST",
        body: form
    })
    .then(res => res.json())
    .then(res => {
        message.channel.send(res.Errors || res.Result, {
            code: !message.flags.includes("nc") ? message.args[0] : undefined
        }).catch(console.log);
    });
}
