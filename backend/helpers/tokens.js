/**
 * @module /backend/helpers/tokens
 * @requires module:jsonwebtoken
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @description creates a new JsonWebToken and returns it to the requesting process
 */

/**
 * jsonwebstoken module
 * @const
 */
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY

/**
 * @description return signed JsonWebToken from user data.
 * @param {Object} user - the user in question
 * @returns {Object} jwt token that will be stored in user's local storage
 */
function createToken(user) {
    console.assert(user.isAdmin !== undefined, "createToken passed user without isAdmin property");

	let payload = {
		id: user.id,
		username: user.username,
		isAdmin: user.isAdmin || false,
	};

    return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
