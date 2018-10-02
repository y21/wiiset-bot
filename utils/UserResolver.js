module.exports = class UserResolver {
	static extract(client, string, includes) {
		return client.users.get(string) || 
			client.users.find(v => v.username === string) || 
			(includes ? client.users.find(v => v.username.includes(string)) : undefined);
	}
	
	static getByTag(UserCollection, tag) {
		return UserCollection.find(v => v.tag === tag);
	}
};
