export interface GatewayPayload<T = any> {
    recipients?: Array<string>;
    type: number;
    data: T
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

export namespace Texts {
    export const PREPARATION = 'ℹ️ Preparation phase has started. Boot up Mario Kart Wii and complete a ghost on {track}.\nWorld Record: {time}';
    export const THRESHOLD_REACHED = '⏱️ Minimum number of players for this lobby has been reached, waiting 30 more seconds for more players to join...';
    export const INGAME_PHASE = '🏎️ Ingame phase has started! Make sure to upload a ghost to the ghost database on the selected track within the next 15 minutes.';
    export const LOBBY_TIME_WARNING = '⚠️ {time} left!';
    export const LOBBY_TIME_WARNING_LAST = `${LOBBY_TIME_WARNING} Please make sure to upload a ghost to the ghost database.`;
    export const LOBBY_END = '✅ Lobby has ended! Results:\n\n';


    export const VOTE_FOR_TRACK = 'Please vote for a track within the next 60 seconds\n';
}