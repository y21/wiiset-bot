import * as ttcConfig from '../../configs/ttc.json';
import fetch from 'node-fetch';
import { hasOption, Maybe } from '../utils/utils';
import Lobby, {LobbyOptions} from '../ttc/lobby';
import { TTC_AUTO_DETECT } from '../utils/constants';

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
        return fetch(TTC.host + endpoint, {
            method: overrideMethod || (body ? 'POST' : 'GET'),
            headers: {
                Authorization: ttcConfig.token
            },
            body: body ? JSON.stringify(body) : undefined
        }).then(x => x.json());
    }

    public static registerUser(userId: string, pid: string) {
        return this.get(Endpoints.USER, { pid });
    }

    public static getUser(userId: string) {
        return this.get(Endpoints.USER + '/' + userId);
    }

    public static getUsers() {
        return this.get(Endpoints.USER); // TODO: construct user objects
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
        return this.get(Endpoints.LOBBY); // TODO: construct lobby objects
    }

    public static getPlayersInLobby(lobbyId: number) {
        return this.get(Endpoints.LOBBY + '/' + lobbyId + '/players'); // TODO: construct user objects
    }

    public static addPlayerToLobby(lobbyId: Maybe<number>, userId: string, channelId: string, password?: string | number) {
        if (typeof password === 'string') password = parseInt(password, 10);

        return this.get(Endpoints.LOBBY + '/' + (lobbyId ?? TTC_AUTO_DETECT) + '/players', {
            userid: userId,
            channel: channelId,
            password: password
        });
    }

    public static removePlayerFromLobby(lobbyId: Maybe<number>, userId: string, channelId: string) {
        return this.get(Endpoints.LOBBY + '/' + (lobbyId ?? TTC_AUTO_DETECT) + '/players', {
            userid: userId,
            channel: channelId
        }, 'DELETE');
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

    public static forceTrack(lobbyId: string, track: string) {
        return this.get(Endpoints.LOBBY + '/' + lobbyId + '/track', { track });
    }
}