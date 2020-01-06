const fetch = require("node-fetch");
const { ctgpAPI } = require("../../configs/apis");


module.exports = {
    name: "ctgpprofile",
    ownerOnly: false,
    guildOnly: false,
    run: (context, args) => {
        return new Promise((resolve, reject) => {
            if (args.length === 0)
                return reject(["⚠️ `No arguments provided...`"]);
        });
    }
};