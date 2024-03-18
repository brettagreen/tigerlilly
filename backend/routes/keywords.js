/**
 * @module /backend/routes/keywords
 * @requires module:jsonschema
 * @requires module:express
 * @requires module:/backend/schemas/keywordsNew
 * @requires module:/backend/schemas/keywordsUpdate
 * @requires module:/backend/models/Keyword
 * @requires module:/backend/expressError.BadRequestError
 * @requires module:/backend/middleware/auth.ensureAdmin
 * @requires module:express.router
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @description handles incoming api requests, initiates appropriate database transaction, returns appriate response
 * 
 */

//typedefs
/**
 * @typedef {Object} keywords - returned keywords object
 * @property {number=} articleId
 * @property {string=} articleTitle
 * @property {string[]|string} keywords
 *
*/

/**
 * jsonschema module
 * @const
 */
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");

/**
 * express module
 * @const
 */
const express = require("express");
const { ensureAdmin } = require("../middleware/auth");
/**
 * schema def for keywords being added to db
 * @const
 */
const newKeywordsSchema = require("../schemas/keywordsNew.json");/**
* schema def for issues being updated
* @const
*/
const updateKeywordsSchema = require("../schemas/keywordsUpdate.json");
/**
 * /backend/models/Issue modeule
 * @const
 */
const Keyword = require("../models/keyword");
/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = express.Router();

/**
 * @description handles request to create new article-keyword association(s).
 * if passed body.articleId value === 0, then passed body.keywords[] value(s)
 * will be associated with all articles in the database and will return a value of 'All Articles' for the articleTitle property.
 * otherwise, will be associated with the article matching articleId. validates form fields, sends req to
 * Keyword class to add to DB, returns new keywords object (or error).
 * @name post/keywords
 * @function
 * @param {string} path - /keywords
 * @param {function} ensureAdmin - only admins can create new keyword article associations
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {keywords} - {keywords: {articleTitle, keywords[] }}
 */
router.post("/", ensureAdmin, async function (req, res, next) {
    try {

        /**@type {keywords} */
        let keywords;
        /**number of fields passed in req.body
         * @type {number}
         */
        const bodyLength = Object.keys(req.body).length;

        if (bodyLength === 2 || bodyLength === 1) {
            /**
             * result of jsonschema validation of req.body object
             * @type {Object}
             */
            const validator = jsonschema.validate(req.body, newKeywordsSchema);

            if (!validator.valid) {
                const errs = validator.errors.map(e => e.stack);
                throw new BadRequestError(errs);
            }

            if (req.body.articleId > 0) {
                keywords = await Keyword.addToArticle(req.body);

            } else {
                keywords = await Keyword.addToAllArticles(req.body.keywords);
            }

        } else {
            throw new BadRequestError("form/body contains incorrect number of arguments");
        }

        return res.json({ keywords });

    } catch (err) {
        return next(err);
    }
});

/**
 * @description returns all (distinct) keywords across all articles, along with articleId and articleTitle
 * @name get/keywords
 * @function
 * @param {string} path - /keywords
 * @param {function} ensureAdmin - only admins can retrieve all distinct keywords across articles
 * @param {callback} middleware - Express middleware.
 * @returns {Object[keywords[]]} - {keywords: [{keyword, articleId, articleTitle}, ...] }
 */
router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const keywords = await Keyword.getKeywords();
        return res.json({ keywords });
    } catch (err) {
        return next(err);
    }
});

/**
 * @description handles request to retrieve keywords associated with passed url param :articleId, sends req to
 * Keyword class, returns keywords object (or error).
 * @name get/keywords/:articleId
 * @function
 * @param {string} path - /keywords
 * @param {number} articleId - path/:articleId
 * @param {callback} middleware - Express middleware.
 * @returns {keywords} - {keywords: [{keyword}, ...] }
 */
router.get("/:articleId", async function (req, res, next) {
    try {
        const keywords = await Keyword.getArticleKeywords(req.params.articleId);
        return res.json({ keywords });
    } catch (err) {
        return next(err);
    }
});


/**
 * @description update keyword with the value passed in the req.body object. i.e {origValue, editValue}. only update these values with article
 * associated with passed url param :articleId. if :articleId === 0 and returned articleTitle value will = 'All Articles' and
 * will update keywords accross all articles where they
 * are found. return keywords object with updated results (or error). 
 * @name patch/keywords/:articleId
 * @function
 * @param {string} path - /keywords
 * @param {number} articleId - path/:articleId
 * @param {function} ensureAdmin - only admins can edit keyword values
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {keywords} - {keywords: {aritcleTitle, keyword} }
 */
router.patch("/:articleId", ensureAdmin, async function (req, res, next) {
    try {

        /**
         * result of jsonschema validation of req.body object
         * @type {Object}
         */
        const validator = jsonschema.validate(req.body, updateKeywordsSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const updateKeywords = await Keyword.updateKeywords(req.params.articleId, req.body);
        return res.json({ updateKeywords });

    } catch (err) {
        return next(err);
    }

});


/**
 * @description delete keyword-article associations from the database. only delete keyword associated with article
 * tied to url param :articleId. if :articleId === 0 and returned articleTitle value will = 'All Articles' and
 * keyword val will be deleted everywhere it is found.
 * @name delete/keywords/:articleId/:keyword
 * @function
 * @param {string} path - /keywords
 * @param {number} articleId - path/:articleId
 * @param {string} keyword - path/:keyword
 * @param {function} ensureAdmin - only admins can delete an keywords
 * @param {callback} middleware - Express middleware.
 * @returns {keywords} - {updateKeywords: { articleTitle, keyword }
 */
router.delete("/:articleId/:keyword", ensureAdmin, async function (req, res, next) {
    try {

        const updateKeywords = await Keyword.delete(req.params.articleId, req.params.keyword);

        return res.json({ updateKeywords });

    } catch (err) {
        return next(err);
    }
});

module.exports = router;