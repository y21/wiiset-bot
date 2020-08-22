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