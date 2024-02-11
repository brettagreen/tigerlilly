"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   * 
   * returns user sans password { id, userFirst, userLast, email, username, isAdmin, icon }
   *  
   **/

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
			// compare hashed password to a new hash from password
			const isValid = await bcrypt.compare(password, user.password);

			if (isValid === true) {
				delete user.password;
				return user;
			}
		}

		//if auth fails
		throw new UnauthorizedError("Invalid username/password");
	}

	/** Register user with passed form data.
	 *
	 * Returns { id, username, userFirst, userLast, email, isAdmin, icon }
	 *
	 **/

	static async register({ username, password, userFirst, userLast, email, isAdmin=false }, icon) {

		const duplicateCheck = await db.query(
			`SELECT username
			FROM users
			WHERE username = $1`,[username]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate username: ${username}`);
		}

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		let query;
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

  /** Find all users.
   *
   * Returns [{ id, username, userFirst, userLast, email, isAdmin, icon }, ...]
   **/

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

  /** Given a username, return data about user.
   *
   * Returns { id, username, userFirst, userLast, email, isAdmin, icon }
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

  /** Return username based on user id
   *
   * Returns username
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
     * return all users that have made one or more comments
     * 
     * returns Returns [{ id, username, userFirst, userLast, email, isAdmin, icon }, ...]
     */

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
   * Data can include:
   *   { userFirst, userLast, email, username, password, icon }
   *
   * Returns { id, userFirst, userLast, email, username, isAdmin, icon }
   *
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

  /** Delete user from database.
   * 
   * returns {username, userFirst, userLast}
   */

	static async remove(id) {
		let result = await db.query(
				`DELETE
				FROM users
				WHERE id = $1
				RETURNING username, user_first AS "userFirst", user_last AS "userLast"`,
				[Number(id)]
		);

		if (!result.rows[0]) throw new NotFoundError(`No user by that id: ${id}`);

		return result.rows[0];
	}

}


module.exports = User;
