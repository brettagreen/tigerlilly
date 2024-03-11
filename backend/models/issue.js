"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions for issues */

class Issue {

    /** create new issue
     *  
     * Returns { id, issueTitle, volume, issue, pubDate }
     * 
     **/

	static async create({ issueTitle, volume, issue }) {
		
		const result = await db.query(
            `INSERT INTO issues
                    (issue_title, volume, issue)
                    VALUES ($1)
                    RETURNING id, issue_title AS "issueTitle", pub_date AS "pubDate"`,
                    [issueTitle, volume, issue]
		);
        
        return result.rows[0];

	}

    /** return all issues.
     *
     * Returns [{ id, issueTitle, volume, issue, pubDate }, ...]
     *
     **/

    static async getAll() {
        const result = await db.query(
            `SELECT *
            FROM issues
            ORDER BY pub_date`);

        return result.rows;
    }

    /** Given issue id, return issue.
     *
     * Returns { issueTitle, volue, issue, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }
     *
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT i.issue_title AS "issueTitle",
                    i.volume,
                    i.issue,
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
     * Returns { issueTitle, volume, issue, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }
     *
     **/

    static async getByTitle(issueTitle) {
        const result = await db.query(
            `SELECT i.issue_title AS "issueTitle",
                    i.volume,
                    i.issue,
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
     * Returns { issueTitle, volue, issue, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }
     *
     **/

    static async getCurrent() {
        const result = await db.query(
            `SELECT i.issue_title AS "issueTitle",
                    i.volume,
                    i.issue,
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
     * Returns { issueTitle, volume, issue, pubDate }
     * 
     **/

    static async update(id, body) {

        let r = await db.query(
            `SELECT * FROM issues WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No issue by that id: ${id}`);

        r = r.rows[0];
        
		const result = await db.query(
            `UPDATE issues
            SET 
            issue_title = $1,
            volume = $2,
            issue = $3,
            pub_date = $4,
            WHERE id = $5
            RETURNING issue_title AS "issueTitle",
                    volume,
                    issue,
                    pub_date AS "pubDate"`,
            [
                body.issueTitle || r.issue_title,
                body.volume || r.volume,
                body.issue || r.issue,
                body.pubDate || r.pubDate,
                id
            ]
        );

        return result.rows[0];
    }

    /** Deletes issue from database.
     * 
     * returns { issueTitle, volume, issue, pubDate }
     */

    static async delete(id) {
        const result = await db.query(
            `DELETE
            FROM issues
            WHERE id = $1
            RETURNING issue_title AS "issueTitle",
            volume,
            issue,
            pub_date AS "pubDate"`, [Number(id)]
        );

        if (!result.rows[0]) throw new NotFoundError(`No issue found by id: ${id}`);

        return result.rows[0];
    }

}

module.exports = Issue;