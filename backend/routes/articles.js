const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");

const express = require("express");
const { ensureAdmin } = require("../middleware/auth");
const newArticleSchema = require("../schemas/articleNew.json");
const updateArticleSchema = require("../schemas/articleUpdate.json");
const Article = require("../models/article");
const router = express.Router();

/** POST / { article }  => { article }
 *
 * Adds new article to DB.
 *
 * This returns the newly created article:
 *  { id, articleTitle, authorFirst, authorLast, authorHandle, authorId, text, issueTitle, issueId }
 *
 * admin only.
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
    try {

        const validator = jsonschema.validate(req.body, newArticleSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const articles = await Article.create(req.body);
        return res.status(201).json({ articles });

    } catch (err) {
        return next(err);
    }
});

/** GET => { articles }
 *
 * Returns {[{ id, articleTitle, authorFirst, authorLast, authorId, text, issueTitle, issueId }, ...]}
 *
 * admin only.
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const articles = await Article.getAll();
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});

/**
 * returns all articles that have one or more comments
 * 
 * returns [{ id, articleTitle, authorFirst, authorLast, authorId, text, issueTitle, issueId }, ...]
 * 
 * admin only
 */

router.get('/comments', ensureAdmin, async function (req, res, next) {
    try {
        const articles = await Article.hasComments();
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});

/** GET /[id] => { article }
 *
 * Returns { articleTitle, authorFirst, authorLast, text, issueTitle }
 *
 * Open to all!
 **/

router.get("/:id", async function (req, res, next) {
    try {
        const articles = await Article.get(req.params.id);
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});

/** GET /articleTitle/[articleTitle] => { article }
 *
 * Returns { articleTitle, authorFirst, authorLast, text, issueTitle }
 *
 * Open to all!
 **/

router.get("/articleTitle/:articleTitle", async function (req, res, next) {
    try {
        const articles = await Article.getByArticleTitle(req.params.articleTitle);
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});


/**
 * returns all articles written by specific author
 * 
 * returns [{articleTitle, authorFirst, authorLast, authorHandle, text, issueId}, ...]
 * 
 * Open to all!
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
 * returns all articles tagged with keyword
 * 
 * returns [{articleTitle, authorFirst, authorLast, authorHandle, text, issueId}, ...]
 * 
 * Open to all!
 */

router.get('/keywords/:keyword', async function (req, res, next) {
    try {
        const articles = await Article.fetchByKeyword(req.params.keyword);
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});


/*
* update an article
*
* all fields can be updated.
*
* Returns { articleTitle, author, authorHandle, text, issueTitle }
**
* admin only
*/

router.patch("/:id", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updateArticleSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const articles = await Article.update(req.params.id, req.body);
        return res.status(201).json({ articles });

    } catch (err) {
        return next(err);
    }
});

/*
 * having been determined that this article isn't funny, it shall now be deleted.
 *
 * Returns { articleTitle, author, text, issueTitle }
 * 
 * admin only
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        const articles = await Article.delete(req.params.id);
        return res.json({ articles });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;