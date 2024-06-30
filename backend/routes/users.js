/**
 * @module /backend/routes/users
 * @requires module:jsonschema
 * @requires module:express
 * @requires module:/backend/middleware/auth.ensureAdmin
 * @requires module:/backend/middleware/auth.ensureCorrectUserOrAdmin
 * @requires module:/backend/expressError.BadRequestError
 * @requires module:/backend/models/User
 * @requires module:/backend/helpers/tokens.createToken
 * @requires module:/backend/schemas/userNew
 * @requires module:/backend/schemas/userUpdate
 * @requires module:/backend/schemas/feedbackNew
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
 * @typedef {Object} user - returned user object 
 * @property {number} id 
 * @property {string} username
 * @property {string} userFirst
 * @property {string} userLast
 * @property {string} email
 * @property {boolean} isAdmin
 * @property {string=} icon
 *
*/

/**
 * @typedef {Object} token - user jwt authentication token
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
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
/**
 * /backend/models/user module
 * @const
 */
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
/**
 * new user schema def
 * @const
 */
const userNewSchema = require("../schemas/userNew.json");
/**
 * schema def for users being updated in db
 * @const
 */
const userUpdateSchema = require("../schemas/userUpdate.json");
/**
 * schema def for website visitors leaving feedback
 * @const
 */
const userFeedbackSchema = require("../schemas/feedbackNew.json");

const { upload, setFile } = require("../helpers/icons");

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = express.Router();

const db = require("../db");

router.post("/testFileUpload", upload.single('icon'), async function (req, res, next) {
    const filename = !req.file ? null : await setFile(req, 'user', [100, 100]);
    console.log('filename', filename);

    return res.status(201).json({file: filename});
});

router.post('/setEnvironment', async function(req, res, next) {
    db.dbURI = req.body.env;
    console.log('new db.dbURI val', db.dbURI);
    return res.send(`set admin environment to ${req.body.env}`);
});


/**
 * @description handles request to create new user, validates form fields, sends req to
 * User class to add to DB, returns new user (or error).
 * @name post/users
 * @function
 * @param {string} path - /users
 * @param {function} ensureAdmin - only admins can create new users via this method
 * @param {function} multer - upload passed file
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {user, token} - { user: {id, username, userFirst, userLast, email, icon, isAdmin }, token }
 */
router.post("/", ensureAdmin, upload.single('icon'), async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const icon = !req.file ? undefined : await setFile(req, 'user', [100, 100], req.body.username);

        const user = await User.register(req.body, icon);
        const token = createToken(user);
        return res.status(201).json({ user, token });

    } catch (err) {
        return next(err);
    }
});

/**
 * @description handles request to create new user, validates form fields, sends req to
 * User class to add to DB, returns new user (or error).
 * @name post/users/register
 * @function
 * @param {string} path - /users/register
 * @param {function} multer - upload passed file
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {user, token} - { user: {id, username, firstName, lastName, email, icon, isAdmin }, token }
 */
router.post("/register", upload.single('icon'), async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
  
        const icon = !req.file ? undefined : await setFile(req, 'user', [100, 100], req.body.username);

        const user = await User.register(req.body, icon);
        const token = createToken(user);

        return res.status(201).json({ user, token });
    } catch (err) {
        return next(err);
    }
});


/**
 * @description handles request to log user into site with username/password, validates form fields, sends req to
 * User class to add to DB, returns new user (or error).
 * @name post/users/login
 * @function
 * @param {string} path - /users/login
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {user, token} - { user: { id, userFirst, userLast, email, username, isAdmin, icon }, token }
 */
router.post("/login", async function (req, res, next) {
    try {
        const user = await User.authenticate(req.body);
        const token = createToken(user);
        return res.status(201).json({ user, token });
    } catch (err) {
        return next(err);
    }
});


/**
 * @description handles request to register user generated feedback, validates form fields, sends req to
 * User class to add to DB, returns new user (or error).
 * @name post/users/feedback
 * @function
 * @param {string} path - /users/feedback
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {Object} - { feedback: { name, email, feedback }}
 */
router.post('/feedback', async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userFeedbackSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const feedback = await User.feedback(req.body);
        return res.status(201).json({ feedback });
    } catch (err) {
        return next(err);
    }
});

/**
 * @description handles request to fetch all users in database, sends req to
 * User class to add to DB, returns new user (or error).
 * @name get/users
 * @function
 * @param {string} path - /users
 * @param {function} ensureAdmin - only admins can retrieve all users at once
 * @param {callback} middleware - Express middleware.
 * @returns {Object[user]} - { users: [{ id, username, userFirst, userLast, email, isAdmin, icon }, ... ] }
 */
router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const users = await User.findAll();
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});


/**
 * @description handles request to get user based on passed url pararm :username, sends req to
 * User class to add to DB, returns new user (or error).
 * @name get/users/username/:username
 * @function
 * @param {string} path - /users/username
 * @param {string} username - path/:username
 * @param {function} ensureCorrectUserOrAdmin - only admins or loggin in user can retrieve this user's data
 * @param {callback} middleware - Express middleware.
 * @returns {user} - { users: { id, username, userFirst, userLast, email, isAdmin, icon }}
 */
router.get("/username/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const users = await User.get(req.params.username);
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

/*
 * returns all users that have made one or more comments
 * 
 * returns [{ id, username, userFirst, userLast, email, isAdmin, icon }, ...]
 * 
 * admin only


router.get('/comments', ensureAdmin, async function (req, res, next) {
    try {
        const users = await User.hasComments();
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});
 */

/** GET /[username] => password reset redirect
 * 
 * Password reset functionality
 * 
 * admin or same-user-as-:username
 

router.get("/:username/forgotPassword", ensureCorrectUserOrAdmin, async function (req, res, next) {

});
*/

/**
 * @description handles request to update an article as determined by passed url param :id. fields of req.body object
 * validate will be updated. sends req to User class to handle request, returns new article (or error).
 * @name patch/users/:id
 * @function
 * @param {string} path - logical path
 * @param {number} id - user id
 * @param {function} ensureCorrectUserOrAdmin - only admins or logged in user can retrieve this user's data
 * @param {function} multer - upload passed file
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {user, token} - { user: { userFirst, userLast, email, username, isAdmin, icon }, token}
 */
router.patch("/:id", ensureCorrectUserOrAdmin, upload.single('icon'), async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        let icon;

        if (!req.file) {
            icon = undefined;
        } else if (!req.body.username) {
            const username = await User.getUsername(req.params.id);
            icon = await setFile(req, 'user', [100, 100], username);
        } else {
            icon = await setFile(req, 'user', [100, 100], req.body.username);
        }

        const user = await User.update(req.params.id, req.body, icon);
        const token = createToken(user);
        return res.json({ user, token });
    } catch (err) {
        return next(err);
    }
});


/**
 * @description handles request to update a user as determined by passed url param :id, sends req to
 * User class to remove from DB, returns deleted user's data (or error).
 * @name delete/users/:id
 * @function
 * @param {string} path - logical path
 * @param {number} id - user id 
 * @param {function} ensureCorrectUserOrAdmin - only admins or logged in user can delete this user
 * @param {function} multer - upload passed file
 * @param {callback} middleware - Express middleware.
 * @throws {BadRequestError}
 * @returns {user} - { users: { userFirst, userLast, email, username, isAdmin, icon }}
 */
router.delete("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const users = await User.remove(req.params.id);
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
