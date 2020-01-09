const RexRest = require("./RexRest");
const CTGPRest = require ("./CTGPRest");
const WiimmfiRest = require("./WiimmfiRest");
const apis = require("../../configs/apis");

module.exports = class RestClient {
    constructor(options = {}) {
        this.rex = new RexRest(options.rex || apis.rexAPI);
        this.ctgp = new CTGPRest(options.ctgp || apis.ctgpAPI);
        this.wiimmfi = new WiimmfiRest(options.wiimmfi || apis.wiimmfiAPI);
    }
};