import fetch from 'node-fetch';

export const languages = new Map([
    ['cs', 1],
    ['vb', 2],
    ['f#', 3],
    ['java', 4],
    ['python', 5],
    ['py', 5],
    ['c', 6],
    ['cpp', 7],
    ['c++', 7],
    ['php', 8],
    ['pascal', 9],
    ['objective-c', 10],
    ['oc', 10],
    ['haskell', 11],
    ['hs', 11],
    ['ruby', 12],
    ['perl', 13],
    ['lua', 14],
    ['asm', 15],
    ['assembly', 15],
    ['sql', 16],
    ['js', 17],
    ['lisp', 18],
    ['prolog', 19],
    ['go', 20],
    ['scala', 21],
    ['scheme', 22],
    ['nodejs', 23],
    ['node', 23],
    ['octave', 25],
    ['d', 30],
    ['r', 31],
    ['tcl', 32],
    ['mysql', 33],
    ['postgres', 34],
    ['oracle', 35],
    ['swift', 37],
    ['bash', 38],
    ['ada', 39],
    ['erlang', 40],
    ['elixir', 41],
    ['ocaml', 42],
    ['kotlin', 43],
    ['brainfuck', 44],
    ['fortran', 45]
]);

export interface Result {
    Errors?: string,
    Result?: string
}

export default class Rex {
    public static host = 'https://rextester.com/rundotnet/api';

    public static resolveLanguage(language: string | number): number {
        let langCode: number | undefined;
        if (typeof language === 'string') {
            langCode = languages.get(language);
        } else if (typeof language === 'number' && !isNaN(language)) {
            return language;
        }

        if (langCode === undefined) {
            throw new Error('Language not found');
        }

        return langCode;
    }

    public static executeCode(language: string | number, code: string): Promise<Result> {
        const lang = String(Rex.resolveLanguage(language));

        return fetch(`${Rex.host}?LanguageChoice=${lang}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'LanguageChoice': lang
            },
            body: JSON.stringify({
                Program: code,
                CompilerArgs: '-o a.out source_file.c'
            })
        }).then(x => x.json());
    }
}