import * as ttcConfig from '../../configs/ttc.json';
import fetch from 'node-fetch';
import { hasOption, Maybe } from '../utils/utils';
import Lobby, {LobbyOptions} from '../ttc/lobby';
import { TTC_AUTO_DETECT } from '../utils/constants';
import { isValidPid } from 'ctgp-rest/dist/src/util';
import User from '../ttc/user';

export namespace Endpoints {
    export const API_VERSION = 'v1';
    export const BASE_PATH = `/api/${API_VERSION}`;
    
    export const USER = BASE_PATH + '/users';
    export const LOBBY = BASE_PATH + '/lobbies';
}

export interface LobbyData {
    options: number,
    aiDiffs?: Array<number>,
    maxRounds?: number,
    ingameTime?: number
}

export default class TTC {
    public static host = (ttcConfig.ssl ? 'https' : 'http') + 
                        '://' + ttcConfig.host;

    // TODO: rename to `request`?
    public static get<T = any, U = any>(endpoint: string, body?: U, overrideMethod?: string): Promise<T> {
        console.log('a');
        return fetch(TTC.host + endpoint, {
            method: overrideMethod || (body ? 'POST' : 'GET'),
            headers: {
                Authorization: ttcConfig.token
            },
            body: body ? JSON.stringify(body) : undefined
        }).then(async (x) => {
            const contentType = x.headers.get('content-type');

            if (contentType === 'application/json') {
                return x.json();
            } else if (x.status >= 400) {
                throw new Error(await x.text());
            } else {
                return x.text();
            }
        });
    }

    public static registerUser(userId: string, pid: string) {
        if (!isValidPid(pid)) {
            throw new Error('invalid pid');
        }

        return this.get(Endpoints.USER, { pid });
    }

    public static getUser(userId: string) {
        return this.get(Endpoints.USER + '/' + userId);
    }

    public static getUsers(sort = true) {
        return this.get(Endpoints.USER)
            .then(x => {
                const arr: Array<User> = [];
                for (const player of x) arr.push(new User(player));
                return sort ? arr.sort((a, b) => b.rating - a.rating) : arr;
            });
    }

    public static createLobby(userId: string, channelId: string, data: LobbyData) {
        if (!hasOption(data.options, LobbyOptions.RT) && !hasOption(data.options, LobbyOptions.CT)) {
            data.options |= LobbyOptions.AT;
        }

        return this.get(Endpoints.LOBBY, {
            userid: userId,
            channel: channelId,
            options: data.options,
            aiDiffs: data.aiDiffs || [],
            maxRounds: data.maxRounds ?? 0,
            ingameTime: data.ingameTime ?? 0
        }).then(x => new Lobby(x));
    }

    public static getLobby(lobbyId: number) {
        return this.get(Endpoints.LOBBY + '/' + lobbyId).then(x => new Lobby(x));
    }

    public static getLobbies() {
        return this.get(Endpoints.LOBBY)
            .then(x => {
                const arr: Array<Lobby> = [];
                for (const lobby of x) arr.push(new Lobby(lobby));
                return arr;
            });
    }

    public static getPlayersInLobby(lobbyId: number) {
        return this.get(Endpoints.LOBBY + '/' + lobbyId + '/players')
            .then(x => {
                const arr: Array<User> = [];
                for (const player of x) arr.push(new User(player));
                return arr;
            });
    }

    public static addPlayerToLobby(lobbyId: Maybe<number>, userId: string, channelId: string, password?: string | number) {
        if (typeof password === 'string') password = parseInt(password, 10);

        return this.get(Endpoints.LOBBY + '/' + (lobbyId ?? TTC_AUTO_DETECT) + '/players', {
            userid: userId,
            channel: channelId,
            password: password
        }).then(x => new Lobby(x));
    }

    public static removePlayerFromLobby(lobbyId: Maybe<number>, userId: string, channelId: string) {
        return this.get(Endpoints.LOBBY + '/' + (lobbyId ?? TTC_AUTO_DETECT) + '/players', {
            userid: userId,
            channel: channelId
        }, 'DELETE').then(x => new Lobby(x));
    }

    public static submitGhost(lobbyId: Maybe<number>, userId: string, channelId: string) {
        return this.get(Endpoints.LOBBY + '/' + (lobbyId ?? TTC_AUTO_DETECT) + '/players/' + userId + '/ghosts', {
            userid: userId,
            channel: channelId
        }); // TODO: construct ghost object?
    }

    public static forceSubmitGhost(userId: string, requesterId: string, finishTime: string, proof?: string) {
        return this.get(Endpoints.LOBBY + '/' + TTC_AUTO_DETECT + '/players/' + userId + '/ghosts/force', {
            requester: requesterId,
            proof,
            finishTime
        }); // TODO: construct ghost object?
    }

    public static forceTrack(lobbyId: number, track: string) {
        return this.get(Endpoints.LOBBY + '/' + lobbyId + '/track', { track });
    }
}