const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const newCommentSchema = require("../schemas/commentNew.json");
const updateCommentSchema = require("../schemas/commentUpdate.json")
const Comment = require("../models/comment");
const router = express.Router();

/** POST
 *
 * Adds new comment to DB.
 *
 * Return value:
 *  { id, userId, username, text, postDate, articleTitle }
 *
 * admin and logged in users
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, newCommentSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const comments = await Comment.create(req.body);
        console.log('server returned comment', comments);
        return res.status(201).json({ comments });

    } catch (err) {
        return next(err);
    }
});

/** GET
 * 
 * Return all comments associated with :userId
 *
 * Return value:
 *  {[{ id, userId, text, articleId, articleTitle, postDate, userFirst, userLast, username, icon }, ...]}
 *
 * all users
 **/

router.get("/users/:userId", async function (req, res, next) {
    try {
        const comments = await Comment.getByUser(req.params.userId);
        return res.json({ comments });
    } catch (err) {
        return next(err);
    }
});

/** GET
 * 
 * Return all comments associated with :articleId
 *
 * Return value:
 *  {[{ id, userId, text, articleId, articleTitle, postDate, userFirst, userLast, username, icon }, ...]}
 *
 * all users
 **/

router.get("/articles/:articleId", async function (req, res, next) {
    try {
        const comments = await Comment.getByArticle(req.params.articleId);
        return res.json({ comments });
    } catch (err) {
        return next(err);
    }
});

/** GET
 * 
 * Return comment from DB.
 *
 * Return value:
 *  { id, text, postDate, userFirst, userLast, username, icon }
 *
 * Admin only!
 **/

router.get("/:id", ensureAdmin, async function (req, res, next) {
    try {
        const comments = await Comment.get(req.params.id);
        return res.json({ comments });
    } catch (err) {
        return next(err);
    }
});

/** PATCH 
 *
 * Udates existing comment's text in DB.
 *
 * Return value:
 *  { id, username, text, articleTitle, postDate }
 *
 * Admin or correct user
 **/

router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updateCommentSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const comments = await Comment.edit(req.params.id, req.body);
        return res.status(201).json({ comments });

    } catch (err) {
        return next(err);
    }
});

/**
 * delete comment.
 * 
 * returns {id, username, text, articleTitle}
 * 
 * admin or correct user
 */

router.delete("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const comments = await Comment.delete(req.params.id);
        return res.json({ comments });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;