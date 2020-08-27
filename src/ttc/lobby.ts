import { makeTypedNullPrototype } from "../utils/utils";

export const LobbyOptions = makeTypedNullPrototype({
    RT: 1,
    CT: 1 << 1,
    AT: (1 | 1 << 1),
    "150cc": 1 << 3,
    "200cc": 1 << 4,
    Elimination: 1 << 5,
    Private: 1 << 6,
    Ranked: 1 << 7,
    Bots: 1 << 8,
    Teams: 1 << 9,
    Teams2: 1 << 10,
    Teams3: 1 << 11,
    Teams4: 1 << 12,
    Teams6: 1 << 13,
    NoGlitch: 1 << 14,
});

export default class Lobby {
    
}