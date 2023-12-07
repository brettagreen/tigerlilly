const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");

const express = require("express");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const newIssueSchema = require("../schemas/issueNew.json");
const updateIssueSchema = require("../schemas/issueUpdate.json")
const Issue = require("../models/issue");
const router = express.Router();

/** POST
 *
 * Adds new issue to DB.
 *
 * Return value:
 *  { id, issueTitle, pubDate }
 * 
 * admin only!
 *
 **/

router.post("/", ensureAdmin, async function (req, res, next) {

    try {
        const validator = jsonschema.validate(req.body, newIssueSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const issues = await Issue.create(req.body.issueTitle);
        return res.status(201).json({ issues });

    } catch (err) {
        return next(err);
    }
});

/** GET
 * 
 * Return all issues from DB
 *
 * Returns [{id, issueTitle, pubDate }, ...]
 *
 * Admin only!
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const issues = await Issue.getAll();
        return res.json({ issues });
    } catch (err) {
        return next(err);
    }
});

/** GET
 * 
 * Return current issue info from DB
 *
 * Return value:
 *  { issueTitle, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }
 *
 * any user
 **/

router.get("/currentIssue", async function (req, res, next) {
    try {
        const issues = await Issue.getCurrent();
        return res.json({ issues })
    } catch (err) {
        return next(err);
    }
});

/** GET by id
 * 
 * Return issue info from DB
 *
 * Return value:
 *  { issueTitle, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }
 *
 * any logged in user
 **/

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const issues = await Issue.get(req.params.id);
        return res.json({ issues });
    } catch (err) {
        return next(err);
    }
});

/** GET by issue's title
 * 
 * Return issue info from DB
 *
 * Return value:
 *  { issueTitle, articleId, articleTitle, text, authorFirst, authorLast, authorHandle }
 *
 * any logged in user
 **/

router.get("/issueTitle/:issueTitle", ensureLoggedIn, async function (req, res, next) {
    try {
        const issues = await Issue.getByTitle(req.params.issueTitle);
        return res.json({ issues });
    } catch (err) {
        return next(err);
    }
});

/** PATCH 
 *
 * Udates issue info in DB.
 *
 * Return value:
 *  { issueTitle, pubDate }
 *
 * Admin only!
 **/

router.patch("/:id", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updateIssueSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const issues = await Issue.update(req.params.id, req.body);
        return res.status(201).json({ issues });

    } catch (err) {
        return next(err);
    }
});

/** deletes comment from article and from database
 * 
 * returns { issueTitle, pubDate }
 *
 * Authorization required: admin
 **/

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        const issues = await Issue.delete(req.params.id);
        return res.json({ issues });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;