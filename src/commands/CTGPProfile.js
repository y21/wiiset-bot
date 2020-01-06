const fetch = require("node-fetch");
const { ctgpAPI } = require("../../configs/apis");
const { CTGPProfileID, Snowflake } = require("../structures/Constants").Regexes;


module.exports = {
    name: "ctgpprofile",
    ownerOnly: false,
    guildOnly: false,
    run: (context, args) => {
        return new Promise((resolve, reject) => {
            if (args.length === 0)
                return reject(["⚠️ `No arguments provided...`"]);
            let pid;
            if (Snowflake.test(args[0])) {
                // todo: get pid from database
            } else if (!CTGPProfileID.test(args[0])) {
                return reject(["⚠️ `Invalid Profile ID provided...`"]);
            } else {
                pid = args[0];
            }


        });
    }
};