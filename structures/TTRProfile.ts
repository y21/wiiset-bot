export interface Profile {
    user: string;
    pid: string;
    rating: number;
    wins: number;
    matches: number;
    currentLobby: string | null;
}