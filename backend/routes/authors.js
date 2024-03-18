/**
 * @module /backend/routes/authors
 * @requires module:jsonschema
 * @requires module:express
 * @requires module:/backend/schemas/authorNew
 * @requires module:/backend/schemas/authorUpdate
 * @requires module:/backend/models/Author
 * @requires module:/backend/expressError.BadRequestError
 * @requires module:/backend/middleware/auth.ensureAdmin
 * @requires module:/backend/helpers/icons.upload
 * @requires module:/backend/helpers/icons.setFile
 * @requires module:express.router
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @description handles incoming api requests, initiates appropriate database transaction, returns appriate response
 * 
 */

//typedefs
/**
 * @typedef {Object} author - returned author object 
 * @property {number} authorId
 * @property {string} authorFirst
 * @property {string} authorLast
 * @property {string} authorLast
 * @property {string} authorHandle
 * @property {string} authorBio
 * @property {string} icon
 * @property {string} authorSlogan
 *
*/

/**
 * jsonschema module
 * @const
 */
const jsonschema = require("jsonschema");
/**
 * express module
 * @const
 */
const express = require("express");
const { ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
/**
 * /backend/models/author module
 * @const
 */
const Author = require("../models/author");
/**
 * schema def for authors being added to db
 * @const
 */
const authorNewSchema = require("../schemas/authorNew.json");
/**
 * schema def for authors being updated in db
 * @const
 */
const authorUpdateSchema = require("../schemas/authorUpdate.json");

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = express.Router();

const { upload, setFile } = require("../helpers/icons");


/**
 * @description handles request to create new author, validates form fields, sends req to
 *  Author class to add to DB, returns new author (or error).
 * @name post/authors
 * @function
 * @param {string} path - /authors
 * @param {function} ensureAdmin - only admins can create new authors
 * @param {function} multer - upload passed file
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {author} - {authors: { id, author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon } }
 */
router.post("/", ensureAdmin, upload.single('icon'), async function (req, res, next) {
    try {
        
        /**
         * result of jsonschema validation of req.body object
         * @type {Object}
         */
        const validator = jsonschema.validate(req.body, authorNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        /**icon filename
         * @type {string}
         */
        const icon = !req.file ? undefined : await setFile(req, 'author', [300, 300]);

        /**
         * @type {author}
         */
        const authors = await Author.create(req.body, icon);
        return res.status(201).json({ authors });

    } catch (err) {
        return next(err);
    }
});


/**
 * @description handles request to retrieve all authors in the database, sends req to
 *  Author class, returns array of author objects (or error).
 * @name get/authors
 * @function
 * @param {string} path - /authors
 * @param {callback} middleware - Express middleware.
 * @returns {Object[author]} - {authors: [{ id, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon }, ...] }
 */
router.get("/", async function (req, res, next) {
    try {
        const authors = await Author.findAll();
        return res.json({ authors });
    } catch (err) {
        return next(err);
    }
});


/**
 * @description handles request to retrieve author matching passed url param :authorHandle. returns author object (or error).
 * @name get/authors/authorHandle/:authorHandle
 * @function
 * @param {string} path - logical path
 * @param {string} authorHandle - path/:authorHandle
 * @param {callback} middleware - Express middleware.
 * @returns {Object[author]} - {authors: { authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon } }
 */
router.get("/authorHandle/:authorHandle", async function (req, res, next) {

    try {
        const authors = await Author.get(req.params.authorHandle);
        return res.json({ authors });
    } catch (err) {
        return next(err);
    }
});

/**
 * @description update an author with the values passed in the req.body object. updates author matching passed url :id param.
 * return author with updated results (or error). 
 * @name patch/authors/:id
 * @function
 * @param {string} path - /authors
 * @param {number} id - path/:id
 * @param {function} ensureAdmin - only admins can edit author info
 * @param {function} multer - upload passed file
 * @param {callback} middleware - Express middleware.
 * @returns {author} - {authors: { authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon } }
 */
router.patch("/:id", ensureAdmin, upload.single('icon'), async function (req, res, next) {
    try {
        /**
         * result of jsonschema validation of req.body object
         * @type {Object}
         */
        const validator = jsonschema.validate(req.body, authorUpdateSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        /**icon filename
         * @type {string}
         */
        let icon;

        if (!req.file) {
            icon = undefined;
        } else if (!req.body.authorHandle) {
            const authorHandle = await Author.getHandle(req.params.id);
            icon = await setFile(req, 'user', [300, 300], authorHandle);
        } else {
            icon = await setFile(req, 'user', [300, 300], req.body.authorHandle);
        }

        /**@type {author} */
        const authors = await Author.update(req.params.id, req.body, icon);
        
        return res.json({ authors });
    } catch (err) {
        return next(err);
    }
});


/**
 * @description delete an author from the database
 * @name delete/authors/:id
 * @function
 * @param {string} path - /authors
 * @param {number} id - path/:id
 * @param {function} ensureAdmin - only admins can delete an author
 * @param {callback} middleware - Express middleware.
 * @returns {author} - {authors: { { author, authorFirst, authorLast, authorHandle, authorSlogan, authorBio, icon } }
 */
router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        const authors = await Author.delete(req.params.id);
        return res.json({ authors });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;