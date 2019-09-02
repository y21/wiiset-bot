export interface Ghost {
    trackName: string | undefined;
    trackVersion: string | undefined;
    finishTimeSimple: string;
    bestSplitSimple: string;
    stars: {
        gold: number;
        silver: number;
        bronze: number;
    };
    "200cc": boolean;
    player: string | undefined;
    country: string | undefined;
    dateSet: string;
}