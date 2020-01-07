const RexRest = require("./RexRest");

module.exports = class RestClient {
    constructor() {
        this.rex = new RexRest();
    }
};