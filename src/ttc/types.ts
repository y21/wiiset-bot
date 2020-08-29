import User, { UserData, Player } from "./user";

export interface GatewayPayload<T = any> {
    recipients?: Array<string>;
    type: number;
    data: T
}

export interface LobbyWarningData {
    remaining: number,
    warnCount: number,
    lobbyID: number
}

export interface Ghost {
    round: number,
    finishTime: string,
    finishTimeSimple: string,
    dateSet: string,
    '200cc': boolean,
    trackName: string,
    timeSeconds: number,
    customGhost: boolean
}

export interface Track {
    name: string,
    authors: Array<string>,
    slotId: number,
    defaultTrack: boolean,
    '200cc': boolean,
    trackId: string,
    ghostCount: number,
    fastestTime: string
}

export interface Team {
    id: number,
    players: Array<Player>,
    points: number;
}

export interface LobbyTrackSelectionData {
    tracks: Array<Track>,
    users: Array<UserData>,
    lobbyID: number
}

export interface LobbyStateChangeData {
    newState: number,
    message: string,
    wrTime: number,
    lobbyID: number
}

export interface RoundEndData {
    eliminated: Array<Player>,
    remainingPlayers: Array<Player>,
    lobbyID: number,
    originalPlayerCount: number,
    wrTime: number
}

export interface LobbyEndData {
    isTeamsMode: boolean,
    winner: UserData | Array<Team>,
    users: UserData | Array<Team>,
    wrTime: number,
    lobbyID: number
}

export interface GhostExpiredData {
    track: string,
    time: number,
    lobby: number
}

export const enum EventType {
    ThresholdReached = 1 << 0,
    TrackSelection = 1 << 1,
    NewTrack = 1 << 2,
    GameStart = 1 << 3,
    RoundEnd = 1 << 4,
    LobbyWarning = 1 << 5,
    LobbyEnd = 1 << 6,
    UserRankUpdate = 1 << 7,
    InvalidGhost = 1 << 8
}

export const enum LobbyStates {
    Waiting = 1 << 0,
    ThresholdReached = 1 << 1,
    MapPick = 1 << 2,
    Preparation = 1 << 3,
    Ingame = 1 << 4,
    Upload = 1 << 5
}

export namespace Texts {
    export const PREPARATION = 'ℹ️ Preparation phase has started. Boot up Mario Kart Wii and complete a ghost on {track}.\nWorld Record: {time}';
    export const THRESHOLD_REACHED = '⏱️ Minimum number of players for this lobby has been reached, waiting 30 more seconds for more players to join...';
    export const INGAME_PHASE = '🏎️ Ingame phase has started! Make sure to upload a ghost to the ghost database on the selected track within the next 15 minutes.';
    export const LOBBY_TIME_WARNING = '⚠️ {time} left!';
    export const LOBBY_TIME_WARNING_LAST = `${LOBBY_TIME_WARNING} Please make sure to upload a ghost to the ghost database.`;
    export const LOBBY_END = '✅ Lobby has ended! Results:\n\n';


    export const VOTE_FOR_TRACK = 'Please vote for a track within the next 60 seconds\n';
}