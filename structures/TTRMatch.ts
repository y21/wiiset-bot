export enum State {
    ENDED = -1,
    WAITING,
    COURSE_SELECTION,
    INGAME,
    CHECK_TIME,
}

export const MatchOptions = {
    RTs: 0x1,
    CTs: 0x2
};

export interface Match {
    id: string;
    participants: string;
    state: number;
    options: number;
    round: number;
    createdAt: string;
    currentPlayers: string;
    course: string | null;
    startedAt: string | null;
    givenTime: number | null;
}

export function stateToString(state: State): string | null {
    return state === State.ENDED ? "Ended" :
        (state === State.WAITING ? "Waiting for players..." :
        (state === State.CHECK_TIME ? "Checking times..." :
        (state === State.INGAME ? "Ingame" :
        (state === State.COURSE_SELECTION ? "Selecting course..." : null))));
}