import {Client, Collection, User} from "discord.js";

export default {
    extract: (client: Client, source: string, includes: boolean = false): User | undefined => {
        return client.users.get(source) ||
            client.users.find(v => v.username === source) ||
            (includes ? client.users.find(v => v.username.includes(source)) : undefined);
    },
    getByTag: (UserCollection: Collection<string, User>, tag: string): User | undefined => {
        return UserCollection.find(v => v.tag === tag);
    }
}