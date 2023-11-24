const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");

const express = require("express");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const newKeywordsSchema = require("../schemas/keywordsNew.json");
const updateKeywordsSchema = require("../schemas/keywordsUpdate.json");
const Keyword = require("../models/keyword");
const router = express.Router();

/**
 * associates keyword(s) with specific article
 * 
 * returns {articleTitle, [keywords]}
 * 
 * admin only
 */

router.post("/", ensureAdmin, async function (req, res, next) {
    try {

        let keywords;
        const bodyLength = Object.keys(req.body).length;

        if (bodyLength === 2 || bodyLength === 1) {

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
 * returns all (distinct) keywords across all articles, along with articleId and articleTitle
 * 
 * returns [{keyword, articleId, articleTitle}, ...]
 * 
 * any logged in user
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const keywords = await Keyword.getKeywords();
        return res.json({ keywords });
    } catch (err) {
        return next(err);
    }
});

/**
 * retrieves all keywords associated with specific article
 * 
 * returns [{keyword, articleId, articleTitle}, ...]
 * 
 * any logged in user
 */

router.get("/:articleId", ensureLoggedIn, async function (req, res, next) {
    try {
        const keywords = await Keyword.getArticleKeywords(req.params.articleId);
        return res.json({ keywords });
    } catch (err) {
        return next(err);
    }
});


/**
 * update keyword value for specific article or for all articles containing the keyword
 * 
 * returns {articleTitle, keyword}
 * 
 * admin only
 */

router.patch("/:articleId", ensureAdmin, async function (req, res, next) {
    try {

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


/*
 * remove keywords from article(s).
 *
 * returns {articleTitle, keyword}
 * 
 * admin only
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