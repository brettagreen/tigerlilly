"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");


/** Related functions for authors. */

class Author {

	/** create author with passed form data.
	 *
	 * returns { id, author, authorFirst, authorLast, authorHandle, authorBio, icon }
	 *
	 **/

	static async create({ authorFirst, authorLast, authorHandle, authorBio }, icon) {
		const duplicateCheck = await db.query(
			`SELECT author_handle
			FROM authors
			WHERE author_handle = $1`,
			[authorHandle]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate author handle: ${authorHandle}`);
		}

		const result = await db.query(
			`INSERT INTO authors
				(author_first,
				author_last,
				author_handle,
				author_bio,
				icon)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, CONCAT(author_first, ' ', author_last) AS "author", author_first AS "authorFirst",
							author_last AS "authorLast", author_handle AS "authorHandle", author_bio AS "authorBio", icon`,
			[
				authorFirst,
				authorLast,
				authorHandle,
				authorBio,
				icon
            ]
		);

		return result.rows[0];
	}

  /** Find all authors.
   *
   * Returns [{ id, authorFirst, authorLast, authorHandle, authorBio, icon }, ...]
   **/

	static async findAll() {
		const result = await db.query(
				`SELECT id,
						author_first AS "authorFirst",
						author_last AS "authorLast",
						author_handle AS "authorHandle",
						author_bio AS "authorBio",
						icon
				FROM authors
				ORDER BY LOWER(author_last)`
		);

		return result.rows;
	}

  /** Given an author's handle, return data about that author.
   *
   * Returns { authorFirst, authorLast, authorHandle, authorBio, icon }
   *
   * Throws NotFoundError if author not found.
   **/

	static async get(authorHandle) {
		const userRes = await db.query(
			`SELECT author_first AS "authorFirst",
					author_last AS "authorLast",
					author_handle AS "authorHandle",
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

  /**
   *
   * Data can include:
   *   { authorFirst, authorLast, authorHandle, authorBio, icon }
   *
   * Returns { author, authorFirst, authorLast, authorHandle, authorBio, icon }
   *
   */

	static async update(id, body, icon) {
		const r = await db.query(
            `SELECT * FROM authors WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No author by that id: ${id}`);

		const result = await db.query(
			`UPDATE authors 
			SET author_first = $1,
			author_last = $2,
			author_handle = $3,
			author_bio = $4,
			icon = $5
			WHERE id = $6
			RETURNING CONCAT(author_first, ' ', author_last) AS "author",
			author_first AS "authorFirst",
			author_last AS "authorLast",
			author_handle AS "authorHandle",
			author_bio AS "authorBio",
			icon`,
			[
				body.authorFirst || r.author_first,
				body.authorLast || r.author_last,
				body.authorHandle || r.author_handle,
				body.authorBio || r.author_bio,
				icon || r.icon,
				id
			]
		);


		if (!result.rows[0]) throw new NotFoundError(`No author found by that id: ${id}`);

		return result.rows[0];
	}

  /** Delete author from database. 
   * 
   * returns { author, authorFirst, authorLast, authorHandle, authorBio, icon }
   */

	static async delete(id) {
		const result = await db.query(
			`DELETE
			FROM authors
			WHERE id = $1
			RETURNING CONCAT(author_first, ' ', author_last) AS "author", author_first AS "authorFirst",
			author_last AS "authorLast", author_handle AS "authorHandle", author_bio AS "authorBio", icon`,
			[Number(id)]
		);

		if (!result.rows[0]) throw new NotFoundError(`No author found by that id: ${id}`);

		return result.rows[0];
	}

}


module.exports = Author;
