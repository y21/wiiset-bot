export default class FlagHandler {
    static from(source: string): Flag[] {
        const flags: Flag[] = [];
        for (let i: number = 0; i < source.length; ++i) {
            if (source.charAt(i) === "-") {
                let flag: Flag = { };
                let nameEnd: number = -1;
                if (source.charAt(i + 1) === "-") {
                    flag.full = "";
                    flag.value = "";
                    for (let j: number = i + 2; j < source.length; ++j) {
                        if (source.charAt(j) === " " || source.charAt(j) === "") {
                            nameEnd = j;
                            break;
                        }
                        flag.full += source.charAt(j);
                    }

                    for (let j: number = nameEnd + 1; j < source.length; ++j) {
                        if (source.charAt(j) === " " || source.charAt(j) === "") break;
                        flag.value += source.charAt(j);
                    }
                } else if (source.charAt(i - 1) !== "-") {
                    flag.pre = "";
                    flag.value = "";
                    for (let j: number = i + 1; j < source.length; ++j) {
                        if (source.charAt(j) === " " || source.charAt(j) === "") {
                            nameEnd = j;
                            break;
                        }
                        flag.pre += source.charAt(j);
                    }

                    for (let j: number = nameEnd + 1; j < source.length; ++j) {
                        if (source.charAt(j) === " " || source.charAt(j) === "") break;
                        flag.value += source.charAt(j);
                    }
                }

                if (flag.full !== ""
                    && flag.pre !== ""
                    && flag.value !== ""
                    && Object.keys(flag).length !== 0) flags.push(flag);
            }
        }
        return flags;
    }
}

export interface Flag {
    full?: string;
    pre?: string;
    value?: string;
}
