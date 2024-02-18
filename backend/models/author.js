"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const { renameFile } = require("../helpers/icons");

/** Related functions for authors. */

class Author {

	/** create author with passed form data.
	 *
	 * returns { id, author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }
	 *
	 **/

	static async create({ authorFirst, authorLast, authorHandle, authorSlogan, authorBio }, icon) {
		const duplicateCheck = await db.query(
			`SELECT author_handle
			FROM authors
			WHERE author_handle = $1`,
			[authorHandle]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate author handle: ${authorHandle}`);
		}

		let query;
		let args;

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

		const result = await db.query(
			query, args
		);

		if (authorBio && authorBio.length > 200) {
			result.rows[0].authorBio = authorBio.substring(0, 200) + "...";
		}

		return result.rows[0];
	}

  /** Find all authors.
   *
   * Returns [{ id, author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }, ...]
   **/

	static async findAll() {
		const result = await db.query(
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

  /** Given an author's handle, return data about that author.
   *
   * Returns { author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }
   *
   * Throws NotFoundError if author not found.
   **/

	static async get(authorHandle) {
		const userRes = await db.query(
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

		const author = userRes.rows[0];

		if (!author) throw new NotFoundError(`No author by that handle: ${authorHandle}`);

		return author;
	}

  /** Given an author's id, return author_handle value.
   *
   * Returns authorHandle
   *
   * Throws NotFoundError if author not found.
   **/

  static async getHandle(id) {
	const authorRes = await db.query(
		`SELECT author_handle AS "authorHandle",
		FROM authors
		WHERE author_handle = $1`,
		[id]
	);

	const authorHandle = authorRes.rows[0].authorHandle;

	if (!authorHandle) throw new NotFoundError(`No author by that id: ${id}`);

	return authorHandle;
}

  /**
   *
   * Data can include:
   *   { authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }
   *
   * Returns { author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }
   *
   */

	static async update(id, body, icon) {

		let r = await db.query(
            `SELECT * FROM authors WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No author by that id: ${id}`);

		r = r.rows[0];

		if (!icon && r.icon) {
			if (req.body.authorHandle) {
				icon = await renameFile(r.authorHandle, req.body.authorHandle, 'author');
			}
		}

		const result = await db.query(
			`UPDATE authors 
			SET author_first = $1,
			author_last = $2,
			author_handle = $3,
			author_slogan = $4
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

  /** Delete author from database. 
   * 
   * returns { author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }
   */

	static async delete(id) {
		const result = await db.query(
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
