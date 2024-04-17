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

let connectionObject = {
	database: getDatabaseUri()
};

if (process.env.DB_HOST !== "null") { //if DB_HOST has a value, then so do all the other process.env.DB... values
	connectionObject.host = process.env.DB_HOST;
	connectionObject.port = process.env.DB_PORT;
	connectionObject.user = process.env.DB_USER;
	connectionObject.ssl = {
		rejectUnauthorized: false
	}
}

db = new Client(
	connectionObject
);

db.connect();

module.exports = db;
