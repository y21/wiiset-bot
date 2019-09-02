export interface Profile {
    user: string;
    pid: string;
    rating: number;
    wins: number;
    matches: number;
    submittedTime: number | null;
    currentLobby: string | null;
    channel: string | null;
}