/**
 * @module /backend/routes/issues
 * @requires module:jsonschema
 * @requires module:express
 * @requires module:/backend/schemas/issueNew
 * @requires module:/backend/schemas/issueUpdate
 * @requires module:/backend/models/Issue
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
 * @typedef {Object} issue - returned issue object 
 * @property {number=} issueId
 * @property {string} issueTitle
 * @property {Date} pubDate
 * @property {number} volume
 * @property {number} issue
 * @property {string=} articleTitle
 * @property {string=} text
 * @property {string=} authorFirst
 * @property {string=} authorLast
 * @property {string=} authorHandle 
 *
*/
//articleTitle, text, authorFirst, authorLast, authorHandle
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
 * schema def for issues being added to db
 * @const
 */
const newIssueSchema = require("../schemas/issueNew.json");
/**
 * schema def for issues being updated
 * @const
 */
const updateIssueSchema = require("../schemas/issueUpdate.json")
/**
 * /backend/models/Issue modeule
 * @const
 */
const Issue = require("../models/issue");
/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = express.Router();


/**
 * @description handles request to create new issue, validates form fields, sends req to
 *  Issue class to add to DB, returns new issue (or error).
 * @name post/issues
 * @function
 * @param {string} path - /issues
 * @param {function} ensureAdmin - only admins can create new issues
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {issue} - {issues: { id, issueTitle, volume, issue, pubDate } }
 */
router.post("/", ensureAdmin, async function (req, res, next) {

    try {
        /**
         * result of jsonschema validation of req.body object
         * @type {Object}
         */
        const validator = jsonschema.validate(req.body, newIssueSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const issues = await Issue.create(req.body);
        return res.status(201).json({ issues });

    } catch (err) {
        return next(err);
    }
});

/**
 * @description handles request to retrieve all issues in the database, sends req to
 *  Issue class, returns array of issue objects (or error).
 * @name get/issues
 * @function
 * @param {string} path - /issues
 * @param {callback} middleware - Express middleware.
 * @returns {Object[issue]} - {issues: [{id, issueTitle, volume, issue, pubDate }, ...] }
 */
router.get("/", async function (req, res, next) {
    try {
        const issues = await Issue.getAll();
        return res.json({ issues });
    } catch (err) {
        return next(err);
    }
});


/**
 * @description handles request to retrieve most recently published issue (based on pubDate), sends req to
 *  Issue class, returns issue object (or error). Returns some article and author info associated with
 * the issue as well.
 * @name get/issues/currentIssue
 * @function
 * @param {string} path - /issues/currentIsue
 * @param {callback} middleware - Express middleware.
 * @returns {issue} - {issues: { issueTitle, volume, issue, pubDate, articleId, articleTitle, text, authorFirst, authorLast, authorHandle } }
 */
router.get("/currentIssue", async function (req, res, next) {
    try {
        const issues = await Issue.getCurrent();
        return res.json({ issues })
    } catch (err) {
        return next(err);
    }
});


/**
 * @description handles request to retrieve issue associated with passed url param :id, sends req to
 *  Issue class, returns issue object (or error). Returns some article and author info associated with
 * the issue as well.
 * @name get/issues/:id
 * @function
 * @param {string} path - /issues
 * @param {number} id - path/:id
 * @param {callback} middleware - Express middleware.
 * @returns {issue} - {issues: { issueTitle, volume, issue, pubDate, articleId, articleTitle, text, authorFirst, authorLast, authorHandle } }
 */
router.get("/:id", async function (req, res, next) {
    try {
        const issues = await Issue.get(req.params.id);
        return res.json({ issues });
    } catch (err) {
        return next(err);
    }
});

/**
 * @description handles request to retrieve issue associated with passed url param :issueTitle, sends req to
 *  Issue class, returns issue object (or error). Returns some article and author info associated with
 * the issue as well.
 * @name get/issues/issueTitle/:issueTitle
 * @function
 * @param {string} path - /issues/issueTitle
 * @param {string} issueTitle - path/:issueTitle
 * @param {callback} middleware - Express middleware.
 * @returns {issue} - {issues: { issueTitle, volume, issue, pubDate, articleId, articleTitle, text, authorFirst, authorLast, authorHandle } }
 */
router.get("/issueTitle/:issueTitle", async function (req, res, next) {
    try {
        const issues = await Issue.getByTitle(req.params.issueTitle);
        return res.json({ issues });
    } catch (err) {
        return next(err);
    }
});

/**
 * @description update an issue with the values passed in the req.body object. updates issue matching passed url :id param.
 * return issue with updated results (or error). 
 * @name patch/issues/:id
 * @function
 * @param {string} path - /issues
 * @param {number} id - path/:id
 * @param {function} ensureAdmin - only admins can edit author info
 * @param {callback} middleware - Express middleware.
 * @returns {issue} - {issues: { issueTitle, volume, issue, pubDate } }
 */
router.patch("/:id", ensureAdmin, async function (req, res, next) {
    try {
        /**
         * result of jsonschema validation of req.body object
         * @type {Object}
         */
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

/**
 * @description delete an issue from the database
 * @name delete/issues/:id
 * @function
 * @param {string} path - /issues
 * @param {number} id - path/:id
 * @param {function} ensureAdmin - only admins can delete an issue
 * @param {callback} middleware - Express middleware.
 * @returns {issue} - {issues: { { issueTitle, volume, issue, pubDate } }
 */
router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        const issues = await Issue.delete(req.params.id);
        return res.json({ issues });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;