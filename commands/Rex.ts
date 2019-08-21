import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";

export default <Command>{
    name: "rex",
    description: "Executes given code __using an external API__. It won't run on the bot's server, don't even try...",
    args: [],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: (base: Base, message: any) => {
        const args: string[] = message.content.split(" ").slice(1);
        const languages: any = {
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
        if (!languages.hasOwnProperty(args[0]))
            throw new Error("Invalid language.");

        return new Promise((a: any, b: any) => {
            fetch("https://rextester.com/rundotnet/api?LanguageChoice=" + languages[args[0]], {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "LanguageChoice": languages[args[0]]
                },
                body: JSON.stringify({
                    "Program": args.slice(1).join(" ").replace(/```\w*/g, ""),
                    "CompilerArgs": "-o a.out source_file.c"
                })
            }).then(res => res.json())
                .then(res => {
                    a([(res.Errors || res.Result).substr(0, 1990), {
                        code: "js"
                    }]);
                }).catch(err => {
                    b(err);
                });
        });
    }
}