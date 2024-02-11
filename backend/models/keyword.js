"use strict";

const db = require("../db");
const {
        NotFoundError,
        BadRequestError
    } = require("../expressError");    
    
    
    /** Related functions for keyword associations */
    
    class Keyword {
    
    /**
     * Associates keyword(s) with specified article.
     * 
     * returns {articleTitle, keywords}
     */

    static async addToArticle({articleId, keywords}) {
        let resp;

        for (let kwd of keywords) {
            resp = await db.query(
                `INSERT INTO article_keywords
                (article_id, keyword)
                VALUES
                ($1, $2)
                RETURNING (SELECT article_title AS "articleTitle" FROM articles WHERE id = $1)`,
                [articleId, kwd]
            );
        }
        return {articleTitle: resp.rows[0].articleTitle, keywords: keywords};
    }

    /**
     * Associates keyword(s) with all articles.
     * 
     * returns {articleTitle, keywords}
     */

    static async addToAllArticles(keywords) {
        const articleIds = await db.query(
            `SELECT id FROM articles`
        );

        for (let kwd of keywords) {
            for (let row of articleIds.rows) {
                await db.query(
                    `INSERT INTO article_keywords
                    (article_id, keyword)
                    VALUES ($1, $2)`,
                    [row.id, kwd]
                );
            }
        }

        return {articleTitle: 'All Articles', keywords: keywords};
    }

    /**
     * returns all keyword/article associations
     * 
     * returns [{keyword, articleId, articleTitle}, ...]
     */

    static async getKeywords() {
        const result = await db.query(
            `SELECT ak.keyword, ak.article_id AS "articleId", a.article_title AS "articleTitle"
            FROM article_keywords ak
            LEFT JOIN articles a ON ak.article_id = a.id
            GROUP BY (ak.keyword, ak.article_id, a.article_title)
            ORDER BY LOWER(ak.keyword) asc`
        );
        
        return result.rows;
    }

    /**
     * returns all keywords for article
     * 
     * returns [{keywords}, ...]
     */

    static async getArticleKeywords(articleId) {
        const result = await db.query(
            `SELECT keyword
            FROM article_keywords
            WHERE article_id = $1
            ORDER BY LOWER(keyword) asc`, [articleId]
        );
        
        return result.rows;
    }

    /**
     * update keyword values from specified article(s)
     * 
     * returns {articleTitle, keyword}
     */

    static async updateKeywords(articleId, {keyword, edit}) {

        if (articleId == 0) {

            await db.query(
                `UPDATE article_keywords
                SET keyword = $1
                WHERE keyword = $2"`,
                [edit, keyword]
            );

            return {articleTitle: 'All Articles', keyword: edit}

        } else {

            await db.query(
                `UPDATE article_keywords
                SET keyword = $1
                WHERE keyword = $2
                AND article_id = $3`,
                [edit, keyword, articleId]
            );

            const subResult = await db.query(
                `SELECT article_title AS "articleTitle"
                FROM articles
                WHERE id = $1`,
                [articleId]
            )

            return {articleTitle: subResult.rows[0].articleTitle, keyword: edit}
        }

    }

    /**
     * remove keywords from specified article(s)
     * 
     * returns {articleTitle, keyword}
     */

    static async delete(articleId, keyword) {
        if (articleId == 0) {

            await db.query(
                `DELETE FROM article_keywords
                WHERE keyword = $1`,
                [keyword]
            );
            
            return {articleTitle: 'All Articles', keyword: keyword}

        } else {
            const result = await db.query(
                `DELETE FROM article_keywords
                WHERE article_id = $1
                AND keyword = $2
                RETURNING (SELECT article_title AS "articleTitle" FROM articles WHERE id = $1)`,
                [articleId, keyword]
            );

            return {articleTitle: result.rows[0].articleTitle, keyword: keyword}
        }
    }

}

module.exports = Keyword;
