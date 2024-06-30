"use strict";
//typedefs
/**
 * @typedef {Object} issue - returned issue object 
 * @property {number=} issueId
 * @property {string} issueTitle
 * @property {Date} pubDate
 * @property {number=} volume
 * @property {number=} issue
 * @property {number=} articleId
 * @property {string=} articleTitle
 * @property {string=} text
 * @property {string=} authorFirst
 * @property {string=} authorLast
 * @property {string=} authorHandle 
 *
*/
/**
 * db module
 * @const
 */
const db = require("../db");

const { NotFoundError, BadRequestError } = require("../expressError");

/**
 * @module /backend/models/issue
 * @requires module:/backend/db
 * @requires module:/backend/expressError.NotFoundError
 * @requires module:/backend/expressError.BadRequestError
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @class
 * @classdesc  database CRUD operations related to issues table
 */

class Issue {

	/**
     * @description create new issue and save to database
	 * 
     * @param {string} issueTitle - title of issue
     * @param {number} volume - volume number issue is a part of
     * @param {number} issue - issue number of issue w/in volume

     * @returns {issue} - { id, issueTitle, volume, issue, pubDate }
     */
	static async create({ issueTitle, volume, issue }) {
		
        const query =`INSERT INTO issues
                    (issue_title, volume, issue)
                    VALUES ($1, $2, $3)
                    RETURNING id, 
                    issue_title AS "issueTitle",
                    volume,
                    issue,
                    pub_date AS "pubDate"`;
        const args = [issueTitle, volume, issue];

        let result;
        try {
            result = await db.getClient().query(query, args);
        } catch {
            throw new BadRequestError('duplicate entry: this issue already exists');
        }
        
        return result.rows[0];

	}

    /**
     * @description return all issues
     *
     * @returns {Object[issue]} - [{ id, issueTitle, volume, issue, pubDate }, ...]
     */
    static async getAll() {
        const result = await db.getClient().query(
            `SELECT id, issue_title AS "issueTitle", volume, issue, pub_date AS "pubDate"
            FROM issues
            ORDER BY pub_date`
        );

        return result.rows;
    }

    /**
     * @description return the current/latest issue and associated articles
     *
     * @returns {Object[issue]} - [ { issueTitle, volume, issue, pubDate, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }...]
     */
    static async getCurrent() {

        const result = await db.getClient().query(
            `SELECT i.issue_title AS "issueTitle",
                    i.volume,
                    i.issue,
                    i.pub_date AS "pubDate",
                    a.id AS "articleId",
                    a.article_title AS "articleTitle",
                    a.text,
                    au.author_first AS "authorFirst",
                    au.author_last AS "authorLast",
                    au.author_handle AS "authorHandle"
            FROM issues i
            LEFT JOIN articles a ON i.id = a.issue_id
            LEFT JOIN authors au ON a.author_id = au.id
            WHERE i.id = (SELECT id from issues ORDER BY pub_date desc LIMIT 1)`
        );
        
        return result.rows;
    }

	/**
     * @description given issue id, return issue and all associated articles
     *
	 * @param {number} id - id of issue to be queried
     * @returns {Object[issue]} - [ { issueTitle, volue, issue, pubDate, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }...]
     */
    static async get(id) {

        let r = await db.getClient().query(
            `SELECT id FROM issues WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No issue found by that id: ${id}`);

        const result = await db.getClient().query(
            `SELECT i.issue_title AS "issueTitle",
                    i.volume,
                    i.issue,
                    i.pub_date AS "pubDate",
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

    /**
     * @description given title of the issue, return issue and all associated articles
     *
	 * @param {string} issueTitle - title of issue to be queried
     * @returns {Object[issue]} - [ { issueTitle, volume, issue, pubDate, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }...]
     */
    static async getByTitle(issueTitle) {

        let r = await db.getClient().query(
            `SELECT id FROM issues WHERE issue_title=$1`, [issueTitle]
        );

		if (!r.rows[0]) throw new NotFoundError(`No issue found by that title: ${issueTitle}`);

        const result = await db.getClient().query(
            `SELECT i.issue_title AS "issueTitle",
                    i.volume,
                    i.issue,
                    i.pub_date AS "pubDate",
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

	/**
     * @description updates an issue. all issue fields can be modified.
     *
	 * @param {number} id - id of issue to be updated
     * @param {Object} body - http request body object. this included all issue fields to be updated.
	 * if specific field isn't being updated, i.e. isn't included in the body object, then sql update statement
	 * will fall back to existing value
	 * @throws {NotFoundError}
     * @returns {issue} - { issueTitle, volume, issue, pubDate }
     */
    static async update(id, body) {

        let r = await db.getClient().query(
            `SELECT * FROM issues WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No issue found by that id: ${id}`);

        r = r.rows[0];
        
		const result = await db.getClient().query(
            `UPDATE issues
            SET 
            issue_title = $1,
            volume = $2,
            issue = $3,
            pub_date = $4
            WHERE id = $5
            RETURNING issue_title AS "issueTitle",
                      volume,
                      issue,
                      pub_date AS "pubDate"`,
            [
                body.issueTitle || r.issue_title,
                body.volume || r.volume,
                body.issue || r.issue,
                body.pubDate || r.pub_date,
                id
            ]
        );

        return result.rows[0];
    }

	/**
     * @description deletes issue from database.
     *
	 * @param {number} id - id of issue to be deleted
	 * @throws {NotFoundError}
     * @returns {issue} - { issueTitle, volume, issue, pubDate }
     */
    static async delete(id) {
        const result = await db.getClient().query(
            `DELETE
            FROM issues
            WHERE id = $1
            RETURNING issue_title AS "issueTitle",
            volume,
            issue,
            pub_date AS "pubDate"`, [Number(id)]
        );

        if (!result.rows[0]) throw new NotFoundError(`No issue found by that id: ${id}`);

        return result.rows[0];
    }

}

module.exports = Issue;
