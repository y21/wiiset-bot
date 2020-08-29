import { Message } from 'detritus-client/lib/structures';
import { Context } from 'detritus-client/lib/command';
import { Types } from 'ctgp-rest';
import { SNOWFLAKE_REGEX, MENTION_REGEX } from './constants';

export function timeSecondsToString(time: number): string {
    const min = time / 60 | 0;
    const sec = time % 60;
    const ms = sec - (sec | 0);
    return String(min).padStart(2, "0") + ":" + String(sec | 0).padStart(2, '0') + (String(ms).slice(1, 5) || ".000");
}

export function calculatePoints(timeOffWr: number) {
    return Math.max(15 - (1.5 * timeOffWr), 3);
}

export type Serializable = string | number | boolean;

export interface TableData {
    header: Array<Serializable>;
    rows: Array<Array<Serializable>>;
    offset?: number;
}

export function generateTable(data: TableData): string {
    let fd = [ data.header, ...data.rows ];
    
    let longest: Array<number> = [];

    for (let i = 0; i < fd[0].length; ++i) {
        for (let j = 0; j < fd.length; ++j) {
            const thisCell = String(fd[j][i]);
            if (!longest[i] || thisCell.length > longest[i]) longest[i] = thisCell.length;
        }
    }

    let value = fd.map((x) => {
        return x.map((x, i) => {
            const padding = longest[i] + (data.offset ?? 2);
            return String(x).padEnd(padding, ' ');
        }).join('');
    }).join('\n');

    return value;
}

export function generateTableWithBorder(data: TableData, delim = '---') {
    data.rows.unshift(Array(data.header.length).fill(delim));
    return generateTable(data);
}

export function hasOption(options: number, lookFor: number) {
    return (options & lookFor) === lookFor;
}

export function makeTypedNullPrototype<T = any, V = string | number>(obj: T): T & {
    [key: string]: V
} {
    return Object.setPrototypeOf(obj, null);
}

export function getAttachmentUrl(ctx: Context | Message) {
    return (ctx instanceof Context ? ctx.message : ctx).attachments.first()?.url;
}

export function getCorrectTrackHash(track: Types.Responses.Leaderboard, includeSeparator = false) {
    return track.slotId.toString(16).padStart(2, '0') + 
        (includeSeparator ? '/' : '') +
        track.trackId;
}

export function flat<T, U = any>(
    arr: Array<U>,
    entriesPerPage: number,
    pageCb: (el: U, i: number) => T
): Array<T> {
    const res: Array<T> = [];

    for (let i = 0; i < arr.length; i += entriesPerPage) res.push(pageCb(arr[i], i));

    return res;
}

export function normalize(str: any) {
    if (typeof str !== 'string') str = String(str);

    let ret = str.charAt(0).toUpperCase();

    for (let i = 1; i < str.length; ++i) {
        const tc = str.charAt(i);

        if (tc >= 'A' && tc <= 'Z') {
            ret += ` ${tc}`
        } else {
            ret += tc;
        }
    }

    return ret;
}

interface NormalizeOptions {
    prettyNumbers?: boolean,
    excludeKeys?: Set<string>
}

export function makeNormalizedFields<T = any>(data: T, options?: NormalizeOptions): Array<{
    name: string,
    value: string
}> {
    return Object.entries(data)
        .filter(([k]) => !options?.excludeKeys?.has(k))
        .map(([k, v]) => ({
            name: normalize(k),
            value: normalize(
                typeof v === 'number' && options?.prettyNumbers ? v.toLocaleString() : v
            )
        }));
}

export function formatDate(b: number) {
    return ~~(b / (60000 * 60)) + " hours, " + ~~(b / (60000) - 60 * ~~(b / (60000 * 60))) + " minutes and " + ~~(b / (1000) - 60 * ~~(b / (60000))) + " seconds ago";
}

export function randomFrom<T>(arr: Array<T>): T | undefined {
    return arr[Math.random() * arr.length | 0];
}

export function resolveUser(str: string, me?: string) {
    if (str.startsWith('<@') && str.endsWith('>')) {
        const [, match] = str.match(MENTION_REGEX) ?? [];
        return match;
    } else if (SNOWFLAKE_REGEX.test(str)) {
        return str;
    } else if (str === 'me') {
        return me;
    }
}

export function formatConstantKey(str: string) {
    let ret = '';

    for (let i = 0; i < str.length; ++i) {
        if (i === 0) ret += str[i];
        else if (str[i] === '_') ret += ' ';
        else ret += String.fromCharCode(str[i].charCodeAt(0) | (1 << 5));
    }

    return ret;
}

export type Maybe<T> = T | undefined;