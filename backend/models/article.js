"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");


/** Related functions for articles */

class Article {

    /** create new article
     *  
     * Returns { id, articleTitle, authorFirst, authorLast, authorHandle, authorId, text, issueTitle, issueId }
     * 
     **/

	static async create({ articleTitle, authorId, text, issueId }) {
		const result = await db.query(
            `INSERT INTO articles 
                    (article_title,
                    author_id,
                    text,
                    issue_id)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, article_title AS "articleTitle", 
                    (SELECT author_first AS "authorFirst" FROM authors WHERE id = $2), 
                    (SELECT author_last AS "authorLast" FROM authors WHERE id = $2),
                    (SELECT author_handle AS "authorHandle" FROM authors WHERE id = $2),
                    author_id AS "authorId", text, (SELECT issue_title AS "issueTitle" FROM issues WHERE id = $4),
                    issue_id AS "issueId"`,
			[articleTitle, authorId, text, issueId]
		);
        
        return result.rows[0];

	}

    /** Returns all articles.
     *
     * Returns [{ id, articleTitle, authorFirst, authorLast, authorId, text, issueTitle, issueId }, ...]
     *
     **/

    static async getAll() {
        const result = await db.query(
            `SELECT a.id,
                    a.article_title AS "articleTitle",
                    w.author_first AS "authorFirst",
                    w.author_last AS "authorLast",
                    w.id AS "authorId",
                    a.text,
                    i.issue_title AS "issueTitle",
                    i.id AS "issueId"
            FROM articles a
            LEFT JOIN authors w ON a.author_id = w.id
            LEFT JOIN issues i ON a.issue_id = i.id
            ORDER BY LOWER(a.article_title)`);

        return result.rows;
    
    }

    /** Given an article id, return article.
     *
     * Returns { articleTitle, authorFirst, authorLast, text, issueTitle }
     *
     **/

    static async get(id) {
        const result = await db.query(
                `SELECT a.article_title AS "articleTitle",
                        w.author_first AS "authorFirst",
                        w.author_last AS "authorLast",
                        a.text,
                        i.issue_title AS "issueTitle"
                FROM articles a
                LEFT JOIN authors w ON a.author_id = w.id
                LEFT JOIN issues i ON a.issue_id = i.id
                WHERE a.id = $1`, [id]);

        const article = result.rows[0];

        if (!article) throw new NotFoundError(`No article found by that id: ${id}`);

        return article;
    }

    /** Given the article's title, return article.
     *
     * Returns { articleTitle, authorFirst, authorLast, text, issueTitle }
     *
     **/

    static async getByArticleTitle(articleTitle) {
        const result = await db.query(
            `SELECT a.article_title AS "articleTitle",
                    w.author_first AS "authorFirst",
                    w.author_last AS "authorLast",
                    a.text,
                    i.issue_title AS "issueTitle"
            FROM articles a
            LEFT JOIN authors w ON a.author_id = w.id
            LEFT JOIN issues i ON a.issue_id = i.id
            WHERE a.article_title = $1`,
            [articleTitle]
        );

        const article = result.rows[0];

        if (!article) throw new NotFoundError(`No article found by that title: ${articleTitle}`);

        return article;
    }


    /**
     * return all articles that contain specified keyword
     * 
     * returns [{articleTitle, authorFirst, authorLast, authorHandle, text, issueId}, ...]
     */

    static async fetchByKeyword(keyword) {
        const result = await db.query(
            `SELECT a.article_title AS "articleTitle",
                    au.author_first AS "authorFirst",
                    au.author_last AS "authorLast",
                    au.author_handle AS "authorHandle",
                    a.text,
                    a.issue_id AS "issueId"
            FROM articles a
            LEFT JOIN article_keywords aw ON a.id = aw.article_id
            LEFT JOIN authors au ON a.author_id = au.id
            WHERE aw.keyword = $1`, [keyword]);
        
        return result.rows;
    }


    /**
     * return all articles written by specific author
     * 
     * returns [{articleTitle, authorFirst, authorLast, authorHandle, text, issueId}, ...]
     */

    static async fetchByAuthor(id) {
        const result = await db.query(
            `SELECT a.article_title AS "articleTitle",
                    au.author_first AS "authorFirst",
                    au.author_last AS "authorLast",
                    au.author_handle AS "authorHandle",
                    a.text,
                    a.issue_id AS "issueId"
            FROM articles a
            LEFT JOIN authors au ON a.author_id = au.id
            WHERE au.id = $1`, [id]);

        return result.rows;
    }

    /**
     * return all articles that have one or more comments
     * 
     * returns [{ id, articleTitle, authorFirst, authorLast, authorId, text, issueTitle, issueId }, ...]
     */

    static async hasComments() {
        const result = await db.query(
            `SELECT a.id,
                    a.article_title AS "articleTitle",
                    w.author_first AS "authorFirst",
                    w.author_last AS "authorLast",
                    w.id AS "authorId",
                    a.text,
                    i.issue_title AS "issueTitle",
                    i.id AS "issueId"
            FROM articles a
            LEFT JOIN authors w ON a.author_id = w.id
            LEFT JOIN issues i ON a.issue_id = i.id
            WHERE a.id IN (SELECT DISTINCT(article_id) FROM comments)`
        );

        return result.rows;
    }  

    /** updates an article 
     * 
     * all article fields can be modified.
     * 
     * Returns { articleTitle, author, authorHandle, text, issueTitle }
     * 
     * **/

    static async update(id, body) {
        const r = await db.query(
            `SELECT * FROM articles WHERE id=$1`, [id]
        );

		if (!r.rows[0]) throw new NotFoundError(`No article found by that id: ${id}`);

		const result = await db.query(
            `UPDATE articles a
            SET article_title = $1,
            author_id = $2,
            text = $3,
            issue_id = $4
            WHERE a.id = $5
            RETURNING a.article_title AS "articleTitle",
                    (SELECT CONCAT(author_first,' ', author_last) AS "author" FROM authors WHERE id = a.author_id),
                    (SELECT author_handle AS "authorHandle" FROM authors WHERE id = a.author_id),
                    a.text,
                    (SELECT issue_title AS "issueTitle" FROM issues WHERE id = a.issue_id)`,
            [
                body.articleTitle || r.article_title,
                body.authorId || r.author_id,
                body.text || r.text,
                body.issueId || r.issue_id,
                id
            ]
        );

        return result.rows[0];
	}


    /** Deletes article from database.
     * 
     * returns {articleTitle, author, authorHandle, text, issueTitle}
     */

    static async delete(id) {

        const result = await db.query(
                `DELETE
                FROM articles
                WHERE id = $1
                RETURNING article_title AS "articleTitle", 
                          (SELECT CONCAT(a.author_first,' ', a.author_last) AS "author" FROM authors a WHERE a.id = author_id),
                          (SELECT a.author_handle AS "authorHandle" FROM authors a WHERE a.id = author_id),
                          text, (SELECT i.issue_title AS "issueTitle" FROM issues i WHERE i.id = issue_id)`, 
                [Number(id)]
        );

        if (!result.rows[0]) throw new NotFoundError(`No article found by id: ${id}`);

        return result.rows[0];
    }

}

module.exports = Article;
