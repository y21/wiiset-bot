"use strict";
exports.__esModule = true;
exports["default"] = {
    extract: function (client, source, includes) {
        if (includes === void 0) { includes = false; }
        return client.users.get(source) ||
            client.users.find(function (v) { return v.username === source; }) ||
            (includes ? client.users.find(function (v) { return v.username.includes(source); }) : undefined);
    },
    getByTag: function (UserCollection, tag) {
        return UserCollection.find(function (v) { return v.tag === tag; });
    }
};
