/**
 * database client class
 * @const
 */
const { Client } = require("pg");

/**
 * @function
 * @description returns database uri from config module
 */
const { getDatabaseUri } = require("./config");

class db {

    static dbURI;

    static getClient() {
        /**
         * database client object
         * @const 
         * @type {Object}
         */
        let dbClient;

        if (!this.dbURI) {
            this.dbURI = getDatabaseUri();
        }

        let connectionObject = {
            database: this.dbURI
        };

        if (process.env.DB_HOST !== "null") { //if DB_HOST has a value, then so do all the other process.env.DB... values
            connectionObject.host = process.env.DB_HOST;
            connectionObject.port = process.env.DB_PORT;
            connectionObject.user = process.env.DB_USER;
            connectionObject.ssl = {
                rejectUnauthorized: false
            }
        }

        dbClient = new Client(
            connectionObject
        );

	dbClient.connect();

        return dbClient;
    }
}

module.exports = db;
