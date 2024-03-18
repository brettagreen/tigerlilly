/**
 * @module /backend/routes/articles
 * @requires module:jsonschema
 * @requires module:express
 * @requires module:/backend/schemas/articleNew
 * @requires module:/backend/schemas/articleUpdate
 * @requires module:/backend/models/Article
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
 * @typedef {Object} article - returned article object 
 * @property {number} articleId 
 * @property {string} articleTitle
 * @property {string} authorFirst
 * @property {string} authorLast
 * @property {string} authorHandle
 * @property {string} text
 * @property {number} issueId
 * @property {string} issueTitle
 * @property {Date} pubDate
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
 * new article schema def
 * @const
 */
const newArticleSchema = require("../schemas/articleNew.json");
/**
 * schema def for articles being updated in db
 * @const
 */
const updateArticleSchema = require("../schemas/articleUpdate.json");
/**
 * /backend/models/article module
 * @const
 */
const Article = require("../models/article");
/**
 * /backend/models/keyword module
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
 * @description handles request to create new article, validates form fields, sends req to
 *  Article class to add to DB, returns new article (or error).
 * @name post/articles
 * @function
 * @param {string} path - logical path
 * @param {function} ensureAdmin - only admins can create new articles
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {article} - {articles: { id, articleTitle, authorFirst, authorLast, authorHandle, authorId, text, issueTitle, issueId } }
 */
router.post("/", ensureAdmin, async function (req, res, next) {
    try {

        /**
         * result of jsonschema validation of req.body object
         * @type {Object}
         */
        const validator = jsonschema.validate(req.body, newArticleSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        /**@type {article} */
        const articles = await Article.create(req.body);
        return res.status(201).json({ articles });

    } catch (err) {
        return next(err);
    }
});

/**
 * @description handles request to retrieve all articles in the database, sends req to
 *  Article class, returns array of article objects (or error).
 * @name get/articles
 * @function
 * @param {string} path - logical path
 * @param {function} ensureAdmin - only admins can retrieve all articles
 * @param {callback} middleware - Express middleware.
 * @returns {Object[article]} - { articles: [{ id, articleTitle, authorFirst, authorLast, authorId, text, issueTitle, issueId }, ...] }
 */
router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const articles = await Article.getAll();
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});

// /**
//  * returns all articles that have one or more comments
//  * 
//  * returns [{ id, articleTitle, authorFirst, authorLast, authorId, text, issueTitle, issueId }, ...]
//  * 
//  * admin only
//  */

// router.get('/comments', ensureAdmin, async function (req, res, next) {
//     try {
//         const articles = await Article.hasComments();
//         return res.json({ articles });
//     } catch (err) {
//         return next(err);
//     }
// });

/**
 * @description handles request to retrieve article matching url param passed :id value, sends req to
 *  Article class, returns article (or error)
 * @name get/articles/:id
 * @function
 * @param {string} path - /articles
 * @param {number} id - path/:id
 * @param {callback} middleware - Express middleware.
 * @returns {article} - {articles: { articleTitle, authorFirst, authorLast, authorHandle, text, issueTitle } }
 */
router.get("/:id", async function (req, res, next) {
    try {
        const articles = await Article.get(req.params.id);
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});

/**
 * @description handles request to retrieve article matching url param passed :articleTitle value, sends req to
 *  Article class, returns article (or error)
 * @name get/articles/articleTitle/:articleTitle
 * @function
 * @param {string} path - /articles/articleTitle
 * @param {string} articleTitle - path/:articleTitle
 * @param {callback} middleware - Express middleware.
 * @returns {article} - {articles: { articleTitle, authorFirst, authorLast, text, issueTitle } }
 */
router.get("/articleTitle/:articleTitle", async function (req, res, next) {
    try {
        const articles = await Article.getByArticleTitle(req.params.articleTitle);
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});


/**
 * @description handles request to retrieve all articles matching url param passed :handle value, sends req to
 *  Article class, returns articles (or error)
 * @name get/articles/authors/:handle
 * @function
 * @param {string} path - /articles/authors
 * @param {string} handle - path/:handle
 * @param {callback} middleware - Express middleware.
 * @returns {Object[article]} - {articles: [{ articleId, articleTitle, authorFirst, authorLast, authorHandle, text, issueId, issueTitle, pubDate }, ...] }
 */
router.get('/authors/:handle', async function (req, res, next) {
    try {
        const articles = await Article.fetchByAuthor(req.params.handle);
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});

/**
 * @description handles request to retrieve all articles matching url param passed :keyword value, sends req to
 *  Article class, returns articles (or error)
 * @name get/articles/keywords/:keyword
 * @function
 * @param {string} path - /articles/keywords
 * @param {string} keyword - path/:keyword
 * @param {callback} middleware - Express middleware.
 * @returns {Object[article]} - {articles: [{ articleId, articleTitle, authorFirst, authorLast, authorHandle, text, issueId }, ...] }
 */
router.get('/keywords/:keyword', async function (req, res, next) {
    try {
        const articles = await Article.fetchByKeyword(req.params.keyword);
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});

/**
 * @description 
 * returns all articles containing keywords somewhere in its text or title AND returns all articles containing passed hashtag(s)
 * 1) hashtag vals are separated (vals beginning with '*') from keyword vals. hashtag search vals are routed to the Keyword class for handling
 * whereas keyword search vals are routed to the Article class.
 * 2) the results of these operations return article id values to the (this) controlling function
 * 3) these id values are then filtered through a Set to make sure duplicate article id vals are not passed to step 4.
 * 4) unique id vals are then used to retrieve articles.
 * @name get/articles/search/:kwds
 * @function
 * @param {string} path - /articles/search
 * @param {string} kwds - path/:kwds
 * @param {callback} middleware - Express middleware.
 * @returns {Object[article]} - {results: [{ articleId, articleTitle, authorFirst, authorLast, authorHandle, text, issueId, pubDate }, ...] }
 */
router.get('/search/:kwds', async function (req, res, next) {
    try {
        /**
		 * :kwds string split by ','
		 * @type {string[]} */
        const kwds = Array.from(req.params.kwds.split(','));

        /**
		 * keywords array
		 * @type {string[]} */
        const keywords = [];

        /**
		 * hashtags array
		 * @type {string[]} */
        const hashtags = [];

        //console.log('kwds', req.params.kwds);
        for (let item of kwds) {
            if (item.startsWith('*')) {
                hashtags.push(item);
            } else {
                keywords.push(item);
            }
        }

        /**
		 * holds unique article ids returned from keywords search
		 * @type {Set{number}} */
        let keywordsSet; 
        /**
		 * holds unique article ids returned from hashtags search
		 * @type {Set{number}} */
        let hashtagsSet;

        if (keywords) {
            keywordsSet = await Article.search(keywords);
        }
        if (hashtags) {
            hashtagsSet = await Keyword.search(hashtags);
        }

        /**
         * filter out duplicates from keywordsSet and hashtagsSet 
         * 
         * @type {Set{number}}
         */
        const combinedSet = new Set(Array.from(keywordsSet).concat(Array.from(hashtagsSet)));

        /**
         * final results
         * @type {string[article]}
         */
        let results = [];
        for (let id of Array.from(combinedSet)) {
            results.push(await Article.get(id));
        }

        return res.json({ results });
    } catch (err) {
        return next(err);
    }
});


/**
 * @description update an article with the values passed in the req.body object. updates article matching passed url :id param.
 * return article with updated results (or error).
 * @name patch/articles/:id
 * @function
 * @param {string} path - /articles
 * @param {number} id - path/:id
 * @param {function} ensureAdmin - only admins can update an article
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {article} - {articles: { articleTitle, author, authorHandle, text, issueTitle } }
 */
router.patch("/:id", ensureAdmin, async function (req, res, next) {

    try {
        /**
         * result of jsonschema validation of req.body object
         * @type {Object}
         */
        const validator = jsonschema.validate(req.body, updateArticleSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        /**@type {article} */
        const articles = await Article.update(req.params.id, req.body);
        return res.status(201).json({ articles });

    } catch (err) {
        return next(err);
    }
});

/**
 * @description delete an article from the database
 * @name delete/articles/:id
 * @function
 * @param {string} path - logical path
 * @param {number} id - path/:id
 * @param {function} ensureAdmin - only admins can delete an article
 * @param {callback} middleware - Express middleware.
 * @returns {article} - {articles: { { articleTitle, author, authorHandle, text, issueTitle } }
 */
router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        /**@type {article} */
        const articles = await Article.delete(req.params.id);
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;