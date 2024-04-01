"use strict";

/**
 * @module /backend/middleware/auth
 * @requires module:/backend/config.SECRET_KEY
 * @requires module:jsonwebtoken
 * @requires modulde:/backend/expressError.UnauthorizedError
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @description Convenience middleware to handle common auth cases in routes
 * 
 */

/**
 * jsonwebstoken module
 * @const
 */
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/**
 * @description
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals on the server (this will include the username and isAdmin field.)
 * res.locals value will helper server determin auth. status for all future requests
 * It's not an error if no token was provided or if the token is not valid.
 * 
 * @param {Object} req - http request object
 * @param {Object} res - http response object
 * @param {function} next - express.js middleware; move to next middleware on callstack
 */
function authenticateJWT(req, res, next) {
	try {
		/**
		 * user passed authorization headers
		 * @const
		 * @type {string}
		 */
		const authHeader = req.headers && req.headers.authorization;
		if (authHeader) {
			/**user's jsonwebtoken @const @type {string} */
			const token = authHeader.replace(/^[Bb]earer /, "").trim();
			res.locals.user = jwt.verify(token, SECRET_KEY);
		}
		return next();
	} catch (err) {
		return next();
	}
}

/** 
 * @description determines if a user is logged in
 * 
 * @param {Object} req - http request object
 * @param {Object} res - http response object
 * @param {function} next - express.js middleware; move to next middleware on callstack
 * @throws {UnauthorizedError}
 */
function ensureLoggedIn(req, res, next) {
	try {
		if (!res.locals.user) throw new UnauthorizedError();
		return next();
	} catch (err) {
		return next(err);
	}
}

/** 
 * @description determines is a user is either logged in and/or an admin
 * @param {Object} req - http request object
 * @param {Object} res - http response object
 * @param {function} next - express.js middleware; move to next middleware on callstack
 * @throws {UnauthorizedError}
 */
function ensureAdmin(req, res, next) {
	try {
		if (!res.locals.user || !res.locals.user.isAdmin) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

/** 
 * @description 
 * determines if user is admin OR if user's username or id matches value passed in url params
 *
 * @param {Object} req - http request object
 * @param {Object} res - http response object
 * @param {function} next - express.js middleware; move to next middleware on callstack 
 * @throws {UnauthorizedError}
 */
function ensureCorrectUserOrAdmin(req, res, next) {
	try {
		const user = res.locals.user;

		//make sure non-admins can't change account to be admin
		if (req.body && (req.body.isAdmin && !user.isAdmin)) {
			delete req.body.isAdmin
		}

		if (!(user && (user.isAdmin || user.username === req.params.username || user.id == req.params.id))) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}


module.exports = {
	authenticateJWT,
	ensureLoggedIn,
	ensureAdmin,
	ensureCorrectUserOrAdmin
};
