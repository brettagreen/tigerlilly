const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const userLoginSchema = require("../schemas/userLogin.json");

const router = express.Router();


/** POST / { user }  => { users, token }
 *
 * Registers/Adds new user to DB.
 *
 * This returns the newly created user and an authentication token for them:
 *  { { username, firstName, lastName, email, isAdmin }, token }
 * 
 * admin only backend for creating a user
 *
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const users = await User.register(req.body);
        const token = createToken(users);
        return res.status(201).json({ users, token });

    } catch (err) {
        return next(err);
    }
});

/** POST /register { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * all users.
 */

router.post("/register", async function (req, res, next) {

    try {
        const validator = jsonschema.validate(req.body, userNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
  
        const newUser = await User.register(req.body);
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

/** POST /login { user }  => { user, token }
 *
 * Logs user into site, returns token.
 *
 * This returns the logged in user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * all users.
 **/

router.post("/login", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userLoginSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await User.authenticate(req.body);
        const token = createToken(user);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

/**
 * wonderful logout hijinx go here. 
 */

router.post("/logout", async function (req, res, next) {

});

/** GET / => { [{ id, username, firstName, lastName, email, icon }, ... ] }
 *
 * Returns list of all users.
 *
 * admin only.
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const users = await User.findAll();
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});


/** GET /username/[username] => { users }
 *
 * Returns { id, username, userFirst, userLast, email, isAdmin, icon }
 *
 * any logged in user
 **/

router.get("/username/:username", ensureLoggedIn, async function (req, res, next) {
    try {
        const users = await User.get(req.params.username);
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

/**
 * returns all users that have made one or more comments
 * 
 * returns [{ id, username, userFirst, userLast, email, isAdmin, icon }, ...]
 * 
 * admin only
 */

router.get('/comments', ensureAdmin, async function (req, res, next) {
    try {
        const users = await User.hasComments();
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

/** GET /[username] => password reset redirect
 * 
 * Password reset functionality
 * 
 * admin or same-user-as-:username
 */

router.get("/:username/forgotPassword", ensureCorrectUserOrAdmin, async function (req, res,next) {

});


/** PATCH /[id] { user } => { users }
 *
 * Data can include:
 *   { userFirst, userLast, email, icon } for actual user
 *   { userFirst, userLast, email, username, isAdmin, icon } for admin
 *
 * Returns { userFirst, userLast, email, username, isAdmin, icon }
 *
 * admin or same-user-as-:username
 **/

router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const users = await User.update(req.params.id, req.body);
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});


/** DELETE /[id]
 * 
 * returns {username, userFirst, userLast}
 *
 * admin or same-user-as-:username
 **/

router.delete("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const users = await User.remove(req.params.id);
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;