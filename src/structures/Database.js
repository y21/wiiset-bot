const pg = require("pg");

module.exports = class Database {
    constructor(pool, data) {
        this.pool = pool || new pg.Pool(data);
    }

    query(query, values) {
        return new Promise((resolve, reject) => {
            this.pool.query(query, values, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
    }
}