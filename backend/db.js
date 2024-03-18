"use strict";
/**
 * @module /backend/db
 * @requires module:pg
 * @requires module:/backend/config.getDatabaseUri
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @description initiates database connect object, used in /backend/models classes
 * 
 */

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

/**
 * database client object
 * @const 
 * @type {Object}
 */
let db;

if (process.env.NODE_ENV === "production") {
    db = new Client(
		{
        	connectionString: getDatabaseUri(),
			ssl: {
				rejectUnauthorized: false
			}
    	}
	);
} else {
    db = new Client(
		{
    		connectionString: getDatabaseUri()
    	}
	);
}

db.connect();

module.exports = db;