"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions for issues */

class Issue {

    /** create new issue
     *  
     * Returns { id, issueTitle, pubDate }
     * 
     **/

	static async create(issueTitle) {
		
		const result = await db.query(
            `INSERT INTO issues
                    (issue_title)
                    VALUES ($1)
                    RETURNING id, issue_title AS "issueTitle", pub_date AS "pubDate"`,
                    [issueTitle]
		);
        
        return result.rows[0];

	}

    /** return all issues.
     *
     * Returns [{ id, issueTitle, pubDate }, ...]
     *
     **/

    static async getAll() {
        const result = await db.query(
            `SELECT id,
                issue_title AS "issueTitle",
                pub_date AS "pubDate"
            FROM issues
            ORDER BY LOWER(issue_title)`);

        return result.rows;
    }

    /** Given issue id, return issue.
     *
     * Returns { issueTitle, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }
     *
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT i.issue_title AS "issueTitle",
                    a.id AS "articleId",
                    a.article_title AS "articleTitle",
                    a.text,
                    au.author_first AS "authorFirst",
                    au.author_last AS "authorLast",
                    au.author_handle AS "authorHandle"
            FROM issues i
            LEFT JOIN articles a ON i.id = a.issue_id
            LEFT JOIN authors au ON a.author_id = au.id
            WHERE i.id = $1`, [id]);
        
        return result.rows;
    }

    /** Given title of the issue, return issue.
     *
     * Returns { issueTitle, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }
     *
     **/

    static async getByTitle(issueTitle) {
        const result = await db.query(
            `SELECT i.issue_title AS "issueTitle",
                    a.id AS "articleId",
                    a.article_title AS "articleTitle",
                    a.text,
                    au.author_first AS "authorFirst",
                    au.author_last AS "authorLast",
                    au.author_handle AS "authorHandle"
            FROM issues i
            LEFT JOIN articles a ON i.id = a.issue_id
            LEFT JOIN authors au ON a.author_id = au.id
            WHERE i.issue_title = $1`,
            [issueTitle]
        );
        
        return result.rows;
    }

    /** Return the current/latest issue.
     *
     * Returns { issueTitle, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }
     *
     **/

    static async getCurrent() {
        const result = await db.query(
            `SELECT i.issue_title AS "issueTitle",
                    a.id AS "articleId",
                    a.article_title AS "articleTitle",
                    a.text,
                    au.author_first AS "authorFirst",
                    au.author_last AS "authorLast",
                    au.author_handle AS "authorHandle"
            FROM issues i
            LEFT JOIN articles a ON i.id = a.issue_id
            LEFT JOIN authors au ON a.author_id = au.id
            WHERE i.id = (SELECT id from issues ORDER BY id asc LIMIT 1)`
        );
        
        return result.rows;
    }

    /** updates an issue
     * 
     * all issue fields can be modified.
     * 
     * Returns { issueTitle, pubDate }
     * 
     **/

    static async update(id, body) {

        const r = await db.query(
            `SELECT * FROM issues WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No issue by that id: ${id}`);
        
		const result = await db.query(
            `UPDATE issues
            SET 
            issue_title = $1,
            pub_date = $2
            WHERE id = $3
            RETURNING issue_title AS "issueTitle",
                    pub_date AS "pubDate"`,
            [
                body.issueTitle || r.issue_title,
                body.pubDate || r.pubDate,
                id
            ]
        );

        return result.rows[0];
    }

    /** Deletes issue from database.
     * 
     * returns { issueTitle, pubDate }
     */

    static async delete(id) {
        const result = await db.query(
            `DELETE
            FROM issues
            WHERE id = $1
            RETURNING issue_title AS "issueTitle", pub_date AS "pubDate"`, [Number(id)]
        );

        if (!result.rows[0]) throw new NotFoundError(`No issue found by id: ${id}`);

        return result.rows[0];
    }

}

module.exports = Issue;