"use strict";
/**
 * @module /backend/config
 * @requires module:dotenv
 * @requires module:colors
 * @requires module:morgan
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @description holds/exports port info, database URI info, and bycrypt module's 'work factor' value
 * 
 */

/**
 * dotenv module
 * @const
 */
require("dotenv").config();

/**
 * apparently this module allows the application to create colored console logs
 * however it's not referenced here or anywhere else so I have no idea how this import actually functions
 */
require("colors");

/**
 * port app listens on
 * @const
 * @type {number}
 */
const PORT = +process.env.PORT;

/**
 * session key
 * @type {string}
 */
const SECRET_KEY=process.env.SECRET_KEY

/**
 * returns appropriate database 
 * @returns database uri
 */
function getDatabaseUri() {
	const env = process.env.NODE_ENV;
	if (env === "test") {
		return "tigerlilly_test"
	} else if (env === "testing") {
		return "tigerlilly_testing"
	} else {
		return "tigerlilly"
	}
}

/**
 * speed up bcrypt during tests, since the algorithm safety isn't being tested
 * @const
 * @type {number}
 */
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

/**
 * we be logging our configs around here!
 */
console.log("Tigerlilly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
	PORT,
	BCRYPT_WORK_FACTOR,
	SECRET_KEY,
	getDatabaseUri
};
