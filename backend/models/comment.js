"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for comments. */

class Comment {

    /** create new comment
     *  
     * Returns { id, userId, username, text, postDate, articleTitle }
     **/

	static async create({ userId, text, articleId, postDate }) {

        let query;
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

		const result = await db.query( 
            query, args
		);

		const comment = result.rows[0];
        console.log('inserted comment', result.rows);
        
        return comment;

	}

    /** return all comments associated with userId
     *
     * Returns [{ id, userId, text, articleId, articleTitle, postDate, userFirst, userLast, username, icon }, ...]
     *
     **/

    static async getByUser(userId) {
        const result = await db.query(
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

    /** return all comments associated with articleId
     *
     * Returns [{ id, userId, text, articleId, articleTitle, postDate, userFirst, userLast, username, icon }, ...]
     *
     **/

    static async getByArticle(articleId) {
        const result = await db.query(
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
        
        //if (!result.rows[0]) throw new NotFoundError(`No comments associated with that article OR articleId doesn't exist: ${articleId}`);

        console.log('result.rows', result.rows);
        console.log('t/f', result.rows == false);
    
        return result.rows;
    }

    /** Given comment id, return comment.
     *
     * Returns { id, text, postDate, userFirst, userLast, username, icon }
     *
     **/

    static async get(id) {
        const result = await db.query(
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

    /* update comment.
    *
    * Returns { id, username, text, articleTitle, postDate }
    *
    */

	static async edit(id, body) {

        const r = await db.query(
            `SELECT * FROM comments WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No comment by that id: ${id}`);

		const result = await db.query(
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

    /** Deletes comment from database.
     * 
     *  returns { id, username, text, articleTitle }
     * 
     * */

    static async delete(id) {
        const result = await db.query(
                `DELETE
                FROM comments
                WHERE id = $1
                RETURNING id, (SELECT u.username FROM users u WHERE u.id = user_id), text,
                        (SELECT a.article_title AS "articleTitle" FROM articles a WHERE a.id = article_id)`,
            [Number(id)]
        );

        if (!result.rows[0]) throw new NotFoundError(`No comment found by id: ${id}`);

        return result.rows[0];

    }
}

module.exports = Comment;