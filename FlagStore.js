const flags = [ "i", "del", "nc", "l" ];

class FlagStore {
    constructor(flags){
        if(typeof flags !== "object" && !flags.length) throw new ReferenceError("flags has to be an array");
        this._flags = flags;
    }

    static fromString(string){
        const match = string.match(new RegExp("-flag:(" + flags.join("|") + ")(,(" + flags.join("|") + "))* *$", "g"));
        return match ? match.map(e => e.substr(e.search(":") + 1)) : [];
    }

    get flags(){
        return this._flags;
    }

    set flags(value){
        if(typeof value !== "object" && !value.length) throw new ReferenceError("flags has to be an array");
        this._flags = value;
    }
}
FlagStore.flags = flags;

module.exports = FlagStore;
