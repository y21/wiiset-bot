import fetch from "node-fetch";

export namespace Endpoints {
    export const SSBB_STATS = '/rsbj/overview';
    export const MKW_STATS = '/rmcj/overview';
    export const MKW_USERS = '/stats/mkw?m=json';
    export const MKW_REGIONS = '/mkw/regions';
    export const MKW_LIST = '/mkw/rooms';
}

export interface SsbbResult {
    data: {
        totalProfiles: number,
        online: number,
        logins: number
    }
}

export interface MkwRoom {
    type: string,
    room_id: number,
    room_name: string,
    game_id4: string,
    is_mkw: number,
    ol_status: number,
    ol_status_x: string,
    room_start: number,
    race_start: number,
    n_races: number,
    n_members: number,
    n_players: number,
    track: [number, string],
    conn_fail: number,
    conn_fail2: number,
    conn_fail_cat: string,
    conn_success: number,
    mask_active: number,
    members: Array<MkwRoomMember>
}

export interface MkwRoomMember {
    names?: Array<string>,
    ev: number
}

export interface MkwStat {
    type: string,
    time_sec: number,
    time_usec: number,
    debug: number,
    admin: number,
    mod: number,
    owner_id: number
}

export interface MkwDataResult {
    data: {
        totalProfiles: number,
        online: number,
        logins: number
    }
}

export interface MkwRegionsResult {
    ctgp: number,
    ame: number,
    jap: number,
    eur: number
}

export interface MkwListResult {
    worldwides: number,
    continentals: number,
    privates: number,
    players: number
}

export default class Wiimmfi {
    public static originHost = 'https://wiimmfi.de';
    public static host = 'https://wiimmfi-api--y21-.repl.co/api/v2';

    public static get<T = any>(endpoint: string, useOrigin = false): Promise<T> {
        return fetch((useOrigin ? Wiimmfi.originHost : Wiimmfi.host) + endpoint)
            .then(x => x.json());
    }

    public static getSsbbStats() {
        return Wiimmfi.get<SsbbResult>(Endpoints.SSBB_STATS);
    }

    public static getMkwRooms(roomsOnly = true) {
        return Wiimmfi.get<Array<MkwRoom | MkwStat>>(Endpoints.MKW_USERS, true)
            .then(x => {
                if (roomsOnly) {
                    return x.filter(v => v.type === 'room');
                } else {
                    return x;
                }
            });
    }

    public static getMkwRoom(room: string | number) {
        return Wiimmfi.getMkwRooms()
            .then((x) => {
                const rooms = <Array<MkwRoom>>(x);
                return rooms.find(y => y.room_id === room || y.room_name === room);
            });
    }

    public static getMkwUsers(room: string | number, limit = 10, sortVr = true) {
        return Wiimmfi.getMkwRoom(room)
            .then((x) => {
                let arr: Array<MkwRoomMember> = x?.members ?? [];

                if (sortVr) {
                    arr = arr.sort((a, b) => b.ev - a.ev);
                }

                return arr;
            });
    }

    public static getMkwLoginRegions() {
        return Wiimmfi.get<MkwRegionsResult>(Endpoints.MKW_REGIONS);
    }

    public static getMkwData() {
        return Wiimmfi.get<MkwDataResult>(Endpoints.MKW_STATS);
    }

    public static getMkwList() {
        return Wiimmfi.get<MkwListResult>(Endpoints.MKW_LIST);
    }
}