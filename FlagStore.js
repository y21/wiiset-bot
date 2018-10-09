class FlagStore {
    constructor(flags){
        if(typeof flags !== "object" && !flags.length) throw new ReferenceError("flags has to be an array");
        this._flags = flags;
    }

    static fromString(string){
        const match = string.match(new RegExp("-(-|flag:)((\\w+)(=.{1,64})?,?)+", "g"));
		return match !== null ? match[0].replace(/^(--|-flag:)/g, "").split(",").filter(v => v !== "") : [];
    }

    get flags(){
        return this._flags;
    }

    set flags(value){
        if(typeof value !== "object" && !value.length) throw new ReferenceError("flags has to be an array");
        this._flags = value;
    }
}

module.exports = FlagStore;
