"use strict";
exports.__esModule = true;
var Command = /** @class */ (function () {
    function Command(data) {
        this.guildOnly = data.guildOnly;
        this.name = data.name;
        this.description = data.description;
        this.args = data.args;
        this.run = data.run;
        this.category = data.category;
        this.ownerOnly = data.ownerOnly;
    }
    return Command;
}());
exports["default"] = Command;
