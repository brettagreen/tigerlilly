"use strict";
//typedefs
/**
 * @typedef {Object} user - returned user object 
 * @property {number} id 
 * @property {string} username
 * @property {string} userFirst
 * @property {string} userLast
 * @property {string} email
 * @property {boolean} isAdmin
 * @property {string} icon
 *
*/

/**
 * db module
 * @const
 */
const db = require("../db");
/**
 * bcrypt module
 * @const
 */
const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
/**
 * complexity of bcrypt algorithm
 * @const
 */
const { BCRYPT_WORK_FACTOR } = require("../config.js");
/**
 * rename user icon filename
 * @function
 */
const { renameFile } = require("../helpers/icons");

/**
 * @module /backend/models/user
 * @requires module:/backend/db
 * @requires module:bcrypt
 * @requires module:/backend/expressError.BadRequestError
 * @requires module:/backend/expressError.NotFoundError
 * @requires module:/backend/expressError.UnauthorizedError
 * @requires module:/backend/config.BCRYPT_WORK_FACTOR
 * @requires module:/backend/helpers/icons.renameFile
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @class
 * @classdesc  database CRUD operations related to users table
 */
class User {

	/**
     * @description authenticate user based on passed username,password combo
	 * 
     * @param {string} username - username of user passing credentials
     * @param {string} password - password of user passing credentials
	 * @throws {UnauthorizedError}
     * @returns {user} - { id, userFirst, userLast, email, username, isAdmin, icon }
     */
	static async authenticate({ username, password }) {

		// first, try to find the user
		const result = await db.query(
				`SELECT id,
						user_first AS "userFirst",
						user_last AS "userLast",
						email,
						username,
						password,
						is_admin AS "isAdmin",
						icon
				FROM users
				WHERE username = $1`,
			[username]
		);

		const user = result.rows[0];

		if (user) {
			/** does username/password match what's in the database?@const @type {boolean} */
			const isValid = await bcrypt.compare(password, user.password);

			if (isValid === true) {
				delete user.password;
				return user;
			}
		}

		//if auth fails
		throw new UnauthorizedError("Invalid username/password");
	}

	/**
     * @description register new user
	 * 
     * @param {string} username - username value
     * @param {string} password - password value
	 * @param {string} userFirst - first name value
	 * @param {string} userLast - last name value
	 * @param {string} email - user's email
	 * @param {boolean=false} isAdmin - is user an admin?
	 * @param {string=} icon - filename of user icon
 	 * @throws {BadRequestError}
     * @returns {user} - { id, username, userFirst, userLast, email, isAdmin, icon }
     */
	static async register({ username, password, userFirst, userLast, email, isAdmin=false }, icon) {

		const duplicateCheck = await db.query(
			`SELECT username
			FROM users
			WHERE username = $1`,[username]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate username: ${username}`);
		}

		//actual (hashed) value of the password that is stored in the database
		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        /**
		 * the sql query string
		 * @type {string} */
        let query;
        /**
		 * argument values passed to the sql query string
		 * @type {string|number[]} */
		let args;

		if (!icon) {
			query = 
			`INSERT INTO users
				(username,
				password,
				user_first,
				user_last,
				email,
				is_admin)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING id, username, user_first AS "userFirst", user_last AS "userLast", email, is_admin AS "isAdmin", icon`;

			args = [username, hashedPassword, userFirst, userLast, email, isAdmin];

		} else {
			query =
			`INSERT INTO users
				(username,
				password,
				user_first,
				user_last,
				email,
				icon,
				is_admin)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id, username, user_first AS "userFirst", user_last AS "userLast", email, is_admin AS "isAdmin", icon`;

			args = [username, hashedPassword, userFirst, userLast, email, icon, isAdmin];
		}

		const result = await db.query(
			query, args
		);

		const user = result.rows[0];

		return user;
	}

	/**
     * @description register user feedback!
	 * 
     * @param {string} name - submitter's name
     * @param {string} email - submitter's email
	 * @param {string} feedback - submitter's feedback

     * @returns {Object} - { name, email, feedback }
     */
	static async feedback({ name, email, feedback }) {
		const result = await db.query(
			`INSERT INTO feedback
				(name,
				email,
				feedback)
			VALUES ($1, $2, $3)
			RETURNING name, email, feedback`,
			[name, email, feedback]
		);

		return result.rows[0];	
	}

	/**
     * @description return all users
	 * @returns {Object[user]} - [{ id, username, userFirst, userLast, email, isAdmin, icon }, ...]
     */
	 static async findAll() {
		const result = await db.query(
				`SELECT id,
						username,
						user_first AS "userFirst",
						user_last AS "userLast",
						email,
						is_admin AS "isAdmin",
						icon
				FROM users
				ORDER BY LOWER(username)`
		);

		return result.rows;
	}

	/** 
	 * @description Given a username, return data about user.
	 *
	 * @param {string} username - username of user to return info about
	 * @throws {NotFoundError}
	 * @returns {user} { id, username, userFirst, userLast, email, isAdmin, icon }
	 *
	 **/
	static async get(username) {
		const userRes = await db.query(
				`SELECT id,
						username,
						user_first AS "userFirst",
						user_last AS "userLast",
						email,
						is_admin AS "isAdmin",
						icon
				FROM users
				WHERE username = $1`, [username]
		);

		const user = userRes.rows[0];

		if (!user) throw new NotFoundError(`No user: ${username}`);

		return user;
	}

	/** 
	 * @description return username based on passed user id
	 *
	 * @param {string} username - username of user to return info about
	 * @throws {NotFoundError}
	 * @returns {string} username
	 *
	 **/
	static async getUsername(id) {
		const user = await db.query(
				`SELECT username
				FROM users
				WHERE id = $1`, [id]
		);

		if (!user) throw new NotFoundError(`No user with that id: ${id}`);

		return user.rows[0].username;
	}

	/** 
	 * @description return all users who have submitted one or more comments
	 *
	 * @returns {Object[user]} [{ id, username, userFirst, userLast, email, isAdmin, icon }, ...]
	 *
	 **/
    static async hasComments() {
        const result = await db.query(
			`SELECT id,
				username,
				user_first AS "userFirst",
				user_last AS "userLast",
				email,
				is_admin AS "isAdmin",
				icon
			FROM users u
			WHERE id IN (SELECT DISTINCT(user_id) FROM comments)
			ORDER BY username`
        );

        return result.rows;
    }

    /**
     * @description update user values based on passed user id.
     *
     * @param {number} id - id user to be updated
     * @param {Object} body - http request body object. this included all user fields to be updated.
	 * if specific field isn't being updated, i.e. isn't included in the body object, then sql update statement
	 * will fall back to existing value
	 * @param {string} icon - filename value of user icon to be updated
	 * @throws {NotFoundError}
     * @returns {user} - { id, userFirst, userLast, email, username, isAdmin, icon }
     */
	static async update(id, body, icon) {

        let r = await db.query(
            `SELECT * FROM users WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No user found by that id: ${id}`);

		let hashedPW;

		if (body.password) {
			hashedPW = await bcrypt.hash(body.password, BCRYPT_WORK_FACTOR);
		}

		if (body.isAdmin) {
			body.isAdmin = String(body.isAdmin);
		}

		r = r.rows[0];

		if (!icon && r.icon) {
			if (req.body.username) {
				icon = await renameFile(r.username, req.body.username, 'user');
			}
		}

		const result = await db.query(
			`UPDATE users 
			SET user_first = $1,
				user_last = $2,
				email = $3,
				username = $4,
				password = $5,
				icon = $6,
				is_admin = $7
			WHERE id = $8
			RETURNING 
				id,
				username,
				user_first AS "userFirst",
				user_last AS "userLast",
				email,
				username,
				is_admin AS "isAdmin",
				icon`,
			[
				body.userFirst || r.user_first,
				body.userLast || r.user_last,
				body.email || r.email,
				body.username || r.username,
				hashedPW || r.password,
				icon || r.icon,
				body.isAdmin || r.is_admin,
				id
			]
		);

		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user found by that id: ${id}`);

		return user;
	}

    /**
     * @description delete user from database
     *
     * @param {number} id - id of user to delete
	 * @throws {NotFoundError}
     * @returns {user} - {id, username, userFirst, userLast, email, isAdmin, icon}
     */
	static async remove(id) {
		let result = await db.query(
				`DELETE
				FROM users
				WHERE id = $1
				RETURNING id, username, user_first AS "userFirst", user_last AS "userLast"
							email, is_admin AS "isAdmin", icon`,
				[Number(id)]//{ id, username, userFirst, userLast, email, isAdmin, icon }
		);

		if (!result.rows[0]) throw new NotFoundError(`No user by that id: ${id}`);

		return result.rows[0];
	}

}


module.exports = User;
