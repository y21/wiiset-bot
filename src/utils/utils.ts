import { Message } from 'detritus-client/lib/structures';
import { Context } from 'detritus-client/lib/command';
import { Types } from 'ctgp-rest';

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

export type Maybe<T> = T | undefined;