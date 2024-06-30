"use strict";

/**
 * db module
 * @const
 */
const db = require("../db");

const { NotFoundError } = require("../expressError");

/**
 * @module /backend/models/comment
 * @requires module:/backend/db
 * @requires module:/backend/helpers/icons.renameFile
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @class
 * @classdesc  database CRUD operations related to comments table
 */
class Comment {

    /**
     * @description create new comment and save to database
	 * 
     * @param {number=} userId - id of user posting the comment
     * @param {string} text - comment text
     * @param {number=} articleId - id of article that comment is associated with
     * @param {Date=CURRENT_TIMESTAMP} postDate - timestamp of when comment was created

     * @returns {Object} - { id, userId, username, text, postDate, articleTitle }
     */
	static async create({ userId, text, articleId, postDate }) {

        /**
		 * the sql query string
		 * @type {string} */
        let query;
        /**
		 * argument values passed to the sql query string
		 * @type {string|number[]} */
		let args;

        if (!userId && !articleId && !postDate) {
            query = 
            `INSERT INTO comments 
                (text) 
                VALUES ($1)
                RETURNING id, user_id AS "userId",
                text, post_date AS "postDate"`;
            
            args = [text]

        } else if (!userId && !articleId) {
            query =
            `INSERT INTO comments 
                (text, post_date) 
                VALUES ($1, $2)
                RETURNING id, user_id AS "userId", text, post_date AS "postDate"`;
            
            args = [text, postDate];

        } else if (!userId && !postDate) {
            query =
            `INSERT INTO comments 
                (text, article_id) 
                VALUES ($1, $2)
                RETURNING id, user_id AS "userId", text, post_date AS "postDate",
                (SELECT article_title AS "articleTitle" from articles where id = $3)`;

            args = [text, articleId];

        } else if (!articleId && !postDate) {
            query =
            `INSERT INTO comments 
                (user_id, text) 
                VALUES ($1, $2)
                RETURNING id, user_id AS "userId", (SELECT username FROM users WHERE id = $1),
                text, post_date AS "postDate"`;
            
            args = [userId, text];

        } else if (!articleId) {
            query =
            `INSERT INTO comments 
                (user_id, text, post_date) 
                VALUES ($1, $2, $3)
                RETURNING id, user_id AS "userId", (SELECT username FROM users WHERE id = $1),
                text, post_date AS "postDate"`;

            args = [userId, text, postDate];

        } else if (!userId) {
            query =
            `INSERT INTO comments 
                (text, article_id, post_date) 
                VALUES ($1, $2, $3)
                RETURNING id, user_id AS "userId",
                text, post_date AS "postDate", (SELECT article_title AS "articleTitle" from articles where id = $3)`;

            args = [text, articleId, postDate];

        } else if (!postDate) {
            query =
            `INSERT INTO comments 
                (user_id, text, article_id) 
                VALUES ($1, $2, $3)
                RETURNING id, user_id AS "userId", (SELECT username FROM users WHERE id = $1),
                text, post_date AS "postDate", (SELECT article_title AS "articleTitle" from articles where id = $3)`;
            
            args = [userId, text, articleId];

        } else {
            query =
            `INSERT INTO comments 
                (user_id, text, article_id, post_date) 
                VALUES ($1, $2, $3, $4)
                RETURNING id, user_id AS "userId", (SELECT username FROM users WHERE id = $1),
                text, post_date AS "postDate", (SELECT article_title AS "articleTitle" from articles where id = $3)`;

            args = [userId, text, articleId, postDate];
        }

		const result = await db.getClient().query( 
            query, args
		);

		const comment = result.rows[0];
        console.log('inserted comment', result.rows);
        
        return comment;

	}

    /**
     * @description return all comments associated with passed userId
     *
     * @param {number} userId - id of user whose comments to search for
     * @throws {NotFoundError}
     * @returns {Object[]} - [{ id, userId, text, articleId, articleTitle, postDate, userFirst, userLast, username, icon }, ...]
     */
    static async getByUser(userId) {
        const result = await db.getClient().query(
            `SELECT c.id,
                    c.user_id AS "userId",
                    c.text,
                    a.id AS "articleId",
                    a.article_title AS "articleTitle",
                    c.post_date AS "postDate",
                    u.user_first AS "userFirst",
                    u.user_last AS "userLast",
                    u.username,
                    u.icon
            FROM comments c
            LEFT JOIN users u ON u.id = c.user_id
            LEFT JOIN articles a ON a.id = c.article_id
            WHERE c.user_id = $1`,
            [userId]);
        
        if (!result.rows[0]) throw new NotFoundError(`No comments associated with that user OR user by that id doesn't exist: ${userId}`);
    
        return result.rows;
    }

    /**
     * @description return all comments associated with passed articleId
     *
     * @param {number} articleId - id of article whose comments we want
     * @throws {NotFoundError}
     * @returns {Object[]} - [{ id, userId, text, articleId, articleTitle, postDate, userFirst, userLast, username, icon }, ...]
     */
    static async getByArticle(articleId) {
        const result = await db.getClient().query(
            `SELECT c.id,
                    c.user_id AS "userId",
                    c.text,
                    a.id AS "articleId",
                    a.article_title AS "articleTitle",
                    c.post_date AS "postDate",
                    u.user_first AS "userFirst",
                    u.user_last AS "userLast",
                    u.username,
                    u.icon
            FROM comments c
            LEFT JOIN users u ON u.id = c.user_id
            LEFT JOIN articles a ON a.id = c.article_id
            WHERE c.article_id = $1`,
            [articleId]);
        
        if (!result.rows[0]) throw new NotFoundError(`No comments associated with that article OR articleId doesn't exist: ${articleId}`);
    
        return result.rows;
    }

    /**
     * @description Given comment id, return comment.
     *
     * @param {number} id - id of article whose comments we want
     * @throws {NotFoundError}
     * @returns {Object} - { id, text, postDate, userFirst, userLast, username, icon }
     */
    static async get(id) {
        const result = await db.getClient().query(
                `SELECT c.id,
                        c.text,
                        c.post_date AS "postDate",
                        u.user_first AS "userFirst",
                        u.user_last AS "userLast",
                        u.username,
                        u.icon
                FROM comments c
                LEFT JOIN users u ON c.user_id = u.id
                WHERE c.id = $1`, [id]);

        const comment = result.rows[0];

        if (!comment) throw new NotFoundError(`No comment found by that id: ${id}`);

        return comment;
    }

   	/**
     * @description updates a comment. all comment fields can be modified.
     *
	 * @param {number} id - id of comment to be updated
     * @param {Object} body - http request body object. this included all comment fields to be updated.
	 * if specific field isn't being updated, i.e. isn't included in the body object, then sql update statement
	 * will fall back to existing value
	 * @throws {NotFoundError}
     * @returns {Object} - { id, username, text, articleTitle, postDate }
     */
	static async edit(id, body) {

        let r = await db.getClient().query(
            `SELECT * FROM comments WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No comment by that id: ${id}`);

        r = r.rows[0];

		const result = await db.getClient().query(
            `UPDATE comments c
                SET 
                user_id = $1,
                text = $2,
                article_id = $3,
                post_date = $4
                WHERE c.id = $5
                RETURNING c.id,
                (SELECT username FROM users where id = c.user_id),
                c.text,
                (SELECT article_title AS "articleTitle" FROM articles WHERE id = c.article_id),
                c.post_date AS "postDate"`,
            [
                body.userId || r.user_id,
                body.text || r.text,
                body.articleId || r.article_id,
                body.postDate || r.post_date,
                id
            ]
        );
                            
		const comment = result.rows[0];

		return comment;
	}

    /**
     * @description deletes comment from database.
     *
	 * @param {number} id - id of comment to be deleted
	 * @throws {NotFoundError}
     * @returns {Object} - { id, username, text, articleTitle, postDate }
     */
    static async delete(id) {
        const result = await db.getClient().query(
                `DELETE
                FROM comments
                WHERE id = $1
                RETURNING id, (SELECT u.username FROM users u WHERE u.id = user_id), text,
                        (SELECT a.article_title AS "articleTitle" FROM articles a WHERE a.id = article_id),
                        post_date AS "postDate"`,
            [Number(id)]
        );

        if (!result.rows[0]) throw new NotFoundError(`No comment found by id: ${id}`);

        return result.rows[0];

    }
}

module.exports = Comment;
