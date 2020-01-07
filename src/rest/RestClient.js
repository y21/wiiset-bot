const RexRest = require("./RexRest");
const CTGPRest = require ("./CTGPRest");
const apis = require("../../configs/apis");

module.exports = class RestClient {
    constructor(options = {}) {
        this.rex = new RexRest(options.rex || apis.rexAPI);
        this.ctgp = new CTGPRest(options.ctgp || apis.ctgpAPI);
    }
};