//typedefs
/**
 * @typedef {Object} keyword - returned keyword object 
 * @property {number=} articleId
 * @property {string=} articleTitle
 * @property {string|string[]} keyword 
 *
*/

/**
 * db module
 * @const
 */
const db = require("../db");

const { NotFoundError, BadRequestError } = require("../expressError");
    
/**
 * @module /backend/models/keywords
 * @requires module:/backend/db
 * @requires module:/backend/expressError.NotFoundError
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @class
 * @classdesc  database CRUD operations related to article_keywords table
 */
class Keyword {
    
	/**
     * @description associate keyword(s) with specified article
	 * 
     * @param {number} articleId - id of article that keyword(s) should be associated with
     * @param {string[]} keywords - array of keywords to be assicated with designated article

     * @returns {keyword} - {articleTitle, keywords}
     */
    static async addToArticle({articleId, keywords}) {
        let resp;
        let kwd;
		try {
            for (kwd of keywords) {
                resp = await db.getClient().query(
                    `INSERT INTO article_keywords
                    (article_id, keyword)
                    VALUES
                    ($1, $2)
                    RETURNING (SELECT article_title AS "articleTitle" FROM articles WHERE id = $1)`,
                    [articleId, kwd]
                );
            }
		} catch (error) {
			if (error.message.includes('duplicate key value')) {
                throw new BadRequestError(`article-keyword association already exists: ${kwd+'-'+articleId}`)
            } else {
                throw new NotFoundError(`no article found by that id: ${articleId}`);
            }
		}

        return {articleTitle: resp.rows[0].articleTitle, keywords: keywords};
    }

	/**
     * @description associates passed keywords with ALL articles. ignores duplicate key error
     *
	 * @param {number} id - id of issue to be queried
     * @returns {keyword} - {articleTitle, keywords}
     */
    static async addToAllArticles(keywords) {
        const articleIds = await db.getClient().query(
            `SELECT id FROM articles`
        );

        for (let kwd of keywords) {
            for (let row of articleIds.rows) {
                await db.getClient().query(
                    `INSERT INTO article_keywords
                    (article_id, keyword)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING`,
                    [row.id, kwd]
                );
            }
        }

        return {articleTitle: 'All Articles', keywords: keywords};
    }

	/**
     * @description returns all (distinct) keywords across all articles, along with articleId and articleTitle
     *
     * @returns {Object[keyword]} - [{keyword, articleId, articleTitle}, ...]
     */
    static async getKeywords() {
        const result = await db.getClient().query(
            `SELECT ak.keyword, ak.article_id AS "articleId", a.article_title AS "articleTitle"
            FROM article_keywords ak
            LEFT JOIN articles a ON ak.article_id = a.id
            GROUP BY (ak.keyword, ak.article_id, a.article_title)
            ORDER BY LOWER(ak.keyword) asc`
        );
        
        return result.rows;
    }

	/**
     * @description returns all keywords associated with passed articleId
     *
     * @param {number} articleId - id of article to return keyword associations from
     * @returns {keyword} - [{keyword}, ...]
     */
    static async getArticleKeywords(articleId) {
        let r = await db.getClient().query(
            `SELECT * FROM articles WHERE id=$1`, [articleId]
        );
        if (!r.rows[0]) throw new NotFoundError(`no article found by that id: ${articleId}`);

        const result = await db.getClient().query(
                `SELECT keyword
                FROM article_keywords
                WHERE article_id = $1
                ORDER BY LOWER(keyword) asc`, [articleId]
        );
        
        if (result.rows.length === 0) {
            return null;
        }

        return result.rows;
    }

    /**
     * @description
     * returns all articles containing passed hashtag(s)
     * if search term is a match, article id will be returned to the controlling function under (/backend/routes/articles)
     * if search yields no hits, return empty set
     *
     * @param {string[]} hashtags - keywords to be matched with an associated article
     * @returns {Set.<number>} - {...id}
     */
    static async search(hashtags) {
        /**
         * holds result rows that match keyword search query
         * @type {string} */
        let result;

        /**
         * unique article ids which contain one/more keywords in the text or the title
         * @type {Set{number}}
         * @const
         */
        const resultsSet = new Set();

        for (let term of hashtags) {
            result = await db.getClient().query(
                `SELECT article_id FROM article_keywords WHERE keyword ILIKE $1`, 
                    ['%'+term.substring(1,term.length)+'%']
            );

            for (let row of result.rows) {
                resultsSet.add(row.article_id);
            } 
        }

        return resultsSet;
    }

    /**
     * @description update keyword values from specified article(s). if articleId value
     * is 0, then update the keyword across all articles it is associated with.
     *
     * @param {number} articleId - id of article whose keyword(s) to update
     * @param {string} keyword - keyword to be updated
     * @param {string} edit - value original keyword value should be changed to
     * @returns {keyword} - {articleTitle, keyword}
     */
    static async updateKeywords(articleId, {keyword, edit}) {

        const count = await db.getClient().query(
            `SELECT COUNT(*) FROM article_keywords WHERE keyword = $1`,
            [keyword]
        );

        if (count.rows[0].count == 0) {
            throw new NotFoundError(`that keyword doesn't exist: ${keyword}`);
        }

        if (articleId == 0) {

            await db.getClient().query(
                `UPDATE article_keywords
                SET keyword = $1
                WHERE keyword = $2`,
                [edit, keyword]
            );

            return {articleTitle: 'All Articles', keyword: edit}

        } else {

            let r = await db.getClient().query(
                `SELECT * FROM articles WHERE id=$1`, [articleId]
            );
            if (!r.rows[0]) throw new NotFoundError(`no article found by that id: ${articleId}`);

            await db.getClient().query(
                `UPDATE article_keywords
                SET keyword = $1
                WHERE keyword = $2
                AND article_id = $3`,
                [edit, keyword, articleId]
            );

            const subResult = await db.getClient().query(
                `SELECT article_title AS "articleTitle"
                FROM articles
                WHERE id = $1`,
                [articleId]
            )

            return {articleTitle: subResult.rows[0].articleTitle, keyword: edit}
        }

    }

    /**
     * @description remove keywords from specified article(s)
     *
     * @param {number} articleId - id of article passed keyword is to be deleted from.
     * if articleId === 0, then delete the keyword from all articles the keyword is associated
     * @param {string} keyword - the keyword to delete
     * @returns {keyword} - { articleTitle, keyword }
     */
    static async delete(articleId, keyword) {
        const count = await db.getClient().query(
            `SELECT COUNT(*) FROM article_keywords WHERE keyword = $1`,
            [keyword]
        );

        if (count.rows[0].count == 0) {
            throw new NotFoundError(`that keyword doesn't exist: ${keyword}`);
        }

        if (articleId == 0) {

            await db.getClient().query(
                `DELETE FROM article_keywords
                WHERE keyword = $1`,
                [keyword]
            );
            
            return {articleTitle: 'All Articles', keyword: keyword}

        } else {

            let r = await db.getClient().query(
                `SELECT * FROM articles WHERE id=$1`, [articleId]
            );
            if (!r.rows[0]) throw new NotFoundError(`no article found by that id: ${articleId}`);
            
            const result = await db.getClient().query(
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
