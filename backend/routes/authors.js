const jsonschema = require("jsonschema");
const express = require("express");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Author = require("../models/author");
const authorNewSchema = require("../schemas/authorNew.json");
const authorUpdateSchema = require("../schemas/authorUpdate.json");

const router = express.Router();

const { upload, setFile } = require("../helpers/icons");

/** POST / { author }  => { author }
 *
 * Registers/Adds new author to DB.
 *
 * This returns the newly created author:
 *  { id, author, authorFirst, authorLast, authorHandle, authorBio, icon }
 * 
 **/

router.post("/", ensureAdmin, upload.single('icon'), async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, authorNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const icon = !req.file ? undefined : await setFile(req, 'author', [300, 300]);

        const authors = await Author.create(req.body, icon);
        return res.status(201).json({ authors });

    } catch (err) {
        return next(err);
    }
});


/** GET / => {[ { id, authorFirst, authorLast, authorHandle, authorBio, icon }, ... ] }
 *
 * Returns list of all authors
 *
 * admin only.
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const authors = await Author.findAll();
        return res.json({ authors });
    } catch (err) {
        return next(err);
    }
});


/** GET /authorHandle[authorHandle] => { author }
 *
 * Returns { authorFirst, authorLast, authorHandle, authorBio, icon }
 *
 * any logged in user or admin
 **/

router.get("/authorHandle/:authorHandle", ensureLoggedIn, async function (req, res, next) {

    try {
        const authors = await Author.get(req.params.authorHandle);
        return res.json({ authors });
    } catch (err) {
        return next(err);
    }
});


/** PATCH /[handle] { author } => { author }
 *
 * Data can include:
 *   { authorFirst, authorLast, authorHandle, authorBio, icon }
 *
 * Returns { authorFirst, authorLast, authorHandle, authorBio, icon }
 *
 * admin only
 **/

router.patch("/:id", ensureAdmin, upload.single('icon'), async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, authorUpdateSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        
        const icon = !req.file ? undefined : await setFile(req, 'author', [300, 300]);

        const authors = await Author.update(req.params.id, req.body, icon);
        return res.json({ authors });
    } catch (err) {
        return next(err);
    }
});


/** Delete author from database
 *
 * returns { author, authorFirst, authorLast, authorHandle, authorBio, icon }
 * 
 * admin only
 **/

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        const authors = await Author.delete(req.params.id);
        return res.json({ authors });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;