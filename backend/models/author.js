"use strict";
//typedefs
/**
 * @typedef {Object} author - returned author object 
 * @property {number=} authorId
 * @property {string=authorFirst+' '+authorLast} author
 * @property {string} authorFirst
 * @property {string} authorLast
 * @property {string} authorHandle
 * @property {string} authorBio
 * @property {string} icon
 * @property {string} authorSlogan
 *
*/

/**
 * db module
 * @const
 */
const db = require("../db");
/**
 * renameFile
 * @const
 */
const { renameFile } = require("../helpers/icons");

/**
 * @module /backend/models/author
 * @requires module:/backend/db
 * @requires module:/backend/helpers/icons.renameFile
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @class
 * @classdesc  database CRUD operations related to authors table
 */
class Author {

	/**
     * @description create new author and save to database
	 * 
     * @param {string} authorFirst - author's first name
     * @param {string} authorLast - author's last name
     * @param {string} authorHandle - author's alias/nickname
     * @param {string} authorSlogan - author's catchphrase
	 * @param {string=} authorBio - author's biography
	 * @param {string=} icon - filename for author's icon/avatar
	 * @throws {BadRequestError} if passed non-unique authorHandle
     * @returns {author} - { author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }
     */
	static async create({ authorFirst, authorLast, authorHandle, authorSlogan, authorBio }, icon) {
		/**no non-unique author handles!!!
		 * @type {Object[]}
		 * @const
		 */
		const duplicateCheck = await db.getClient().query(
			`SELECT author_handle
			FROM authors
			WHERE author_handle = $1`,
			[authorHandle]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate author handle: ${authorHandle}`);
		}

        /**
		 * the sql query string
		 * @type {string} */
        let query;
        /**
		 * argument values passed to the sql query string
		 * @type {string|number[]} */
		let args;

		//based on passed parms/args, write specific query for specific insert operation
		if (!authorBio && !icon) {
			query = 			
				`INSERT INTO authors
				(author_first,
				author_last,
				author_handle,
				author_slogan)
				VALUES ($1, $2, $3, $4)
				RETURNING id, CONCAT(author_first, ' ', author_last) AS "author", author_first AS "authorFirst",
							author_last AS "authorLast", author_handle AS "authorHandle", author_slogan AS "authorSlogan",
							author_bio AS "authorBio", icon`;
			args = [authorFirst, authorLast, authorHandle, authorSlogan];

		} else if (!authorBio) {
			query = 			
				`INSERT INTO authors
				(author_first,
				author_last,
				author_handle,
				author_slogan,
				icon)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id, CONCAT(author_first, ' ', author_last) AS "author", author_first AS "authorFirst",
							author_last AS "authorLast", author_handle AS "authorHandle", author_slogan AS "authorSlogan",
							author_bio AS "authorBio", icon`;
			args = [authorFirst, authorLast, authorHandle, authorSlogan, icon];
		} else if (!icon) {
			query = 			
				`INSERT INTO authors
				(author_first,
				author_last,
				author_handle,
				author_slogan,
				author_bio)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id, CONCAT(author_first, ' ', author_last) AS "author", author_first AS "authorFirst",
							author_last AS "authorLast", author_handle AS "authorHandle", author_slogan AS "authorSlogan",
							author_bio AS "authorBio", icon`;
				args = [authorFirst, authorLast, authorHandle, authorSlogan, authorBio];
		} else {
			query = 			
				`INSERT INTO authors
				(author_first,
				author_last,
				author_handle,
				author_slogan,
				author_bio,
				icon)
				VALUES ($1, $2, $3, $4, $5, $6)
				RETURNING id, CONCAT(author_first, ' ', author_last) AS "author", author_first AS "authorFirst",
							author_last AS "authorLast", author_handle AS "authorHandle", author_slogan AS "authorSlogan",
							author_bio AS "authorBio", icon`;
				args = [authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon];
		}

		const result = await db.getClient().query(
			query, args
		);

		return result.rows[0];
	}

    /**
     * @description Returns all authors
     *
     * @returns {Object[author]} - [{ id, author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }, ...]
     */
	static async findAll() {
		const result = await db.getClient().query(
				`SELECT id,
						CONCAT(author_first, ' ', author_last) AS "author",
						author_first AS "authorFirst",
						author_last AS "authorLast",
						author_handle AS "authorHandle",
						author_slogan AS "authorSlogan",
						author_bio AS "authorBio",
						icon
				FROM authors
				ORDER BY LOWER(author_last)`
		);

		return result.rows;
	}

	/**
     * @description Given an author's handle, return author object.
     *
	 * @param {string} authorHandle - handle of author object to be returned
	 * @throws {NotFoundError}
     * @returns {author} - { author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }
     */
	static async get(authorHandle) {
		const userRes = await db.getClient().query(
			`SELECT CONCAT(author_first, ' ', author_last) AS "author",
					author_first AS "authorFirst",
					author_last AS "authorLast",
					author_handle AS "authorHandle",
					author_slogan AS "authorSlogan",
					author_bio AS "authorBio",
					icon
			FROM authors
			WHERE author_handle = $1`,
			[authorHandle]
		);

		/**@type {author} */
		const author = userRes.rows[0];

		if (!author) throw new NotFoundError(`No author found by that handle: ${authorHandle}`);

		return author;
	}

	/**
     * @description Given an author's id, return author_handle value.
     *
	 * @param {number} id - id of author
	 * @throws {NotFoundError}
     * @returns {string} - authorHandle
     */
	static async getHandle(id) {
		const authorRes = await db.getClient().query(
			`SELECT author_handle AS "authorHandle"
			FROM authors
			WHERE id = $1`,
			[id]
		);

		/**handle
		 * @type {string}
		 */
		let authorHandle;
		try {
			authorHandle = authorRes.rows[0].authorHandle;
		} catch {
			throw new NotFoundError(`No author found by that id: ${id}`)
		}
		
		return authorHandle;
	}

	/**
     * @description updates an author. all author fields can be modified.
     *
	 * @param {number} id - id of author
     * @param {Object} body - http request body object. this included all author fields to be updated.
	 * if specific field isn't being updated, i.e. isn't included in the body object, then sql update statement
	 * will fall back to existing value
	 * @param {string} icon - updated filename of author icon/avatar
	 * @throws {NotFoundError}
     * @returns {author} - { author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }
     */
	static async update(id, body, icon) {

		let r = await db.getClient().query(
            `SELECT * FROM authors WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No author found by that id: ${id}`);

		r = r.rows[0];

		if (!icon && r.icon) {
			if (body.authorHandle) {
				icon = await renameFile(r.authorHandle, body.authorHandle, 'author');
			}
		}

		const result = await db.getClient().query(
			`UPDATE authors 
			SET author_first = $1,
			author_last = $2,
			author_handle = $3,
			author_slogan = $4,
			author_bio = $5,
			icon = $6
			WHERE id = $7
			RETURNING CONCAT(author_first, ' ', author_last) AS "author",
			author_first AS "authorFirst",
			author_last AS "authorLast",
			author_handle AS "authorHandle",
			author_slogan AS "authorSlogan",
			author_bio AS "authorBio",
			icon`,
			[
				body.authorFirst || r.author_first,
				body.authorLast || r.author_last,
				body.authorHandle || r.author_handle,
				body.authorSlogan || r.author_slogan,
				body.authorBio || r.author_bio,
				icon || r.icon,
				id
			]
		);

		if (result.rows[0].authorBio && (result.rows[0].authorBio).length > 200) {
			result.rows[0].authorBio = (result.rows[0].authorBio).substring(0, 200) + "...";
		}

		if (!result.rows[0]) throw new NotFoundError(`No author found by that id: ${id}`);

		return result.rows[0];
	}

	/**
     * @description deletes author from database.
     *
	 * @param {number} id - id of author
	 * @throws {NotFoundError}
     * @returns {author} - { author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }
     */
	static async delete(id) {
		const result = await db.getClient().query(
			`DELETE
			FROM authors
			WHERE id = $1
			RETURNING CONCAT(author_first, ' ', author_last) AS "author", author_first AS "authorFirst",
			author_last AS "authorLast", author_handle AS "authorHandle", author_slogan AS "authorSlogan",
			author_bio AS "authorBio", icon`,
			[Number(id)]
		);

		if (!result.rows[0]) throw new NotFoundError(`No author found by that id: ${id}`);

		return result.rows[0];
	}

}


module.exports = Author;
