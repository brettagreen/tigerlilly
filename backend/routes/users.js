const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const userLoginSchema = require("../schemas/userLogin.json");
const userFeedbackSchema = require("../schemas/feedbackNew.json");

const { upload, setFile } = require("../helpers/icons");

const router = express.Router();

router.post("/testFileUpload", upload.single('icon'), async function (req, res, next) {
    const filename = !req.file ? null : await setFile(req, 'user', [100, 100]);
    console.log('filename', filename);

    return res.status(201).json({file: filename});
});


/** POST / { user }  => { users, token }
 *
 * Registers/Adds new user to DB.
 *
 * This returns the newly created user and an authentication token for them:
 *  { { id, username, firstName, lastName, email, icon, isAdmin }, token }
 * 
 * admin only backend for creating a user
 *
 **/

router.post("/", ensureAdmin, upload.single('icon'), async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const icon = !req.file ? undefined : await setFile(req, 'user', [100, 100]);

        const user = await User.register(req.body, icon);
        const token = createToken(user);
        return res.status(201).json({ user, token });

    } catch (err) {
        return next(err);
    }
});

/** POST /register { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns { user, token }. Token is used to authenticate further requests.
 *
 * all users.
 */

router.post("/register", upload.single('icon'), async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
  
        const icon = !req.file ? undefined : await setFile(req, 'user', [100, 100]);

        const user = await User.register(req.body, icon);
        const token = createToken(user);

        return res.status(201).json({ user, token });
    } catch (err) {
        return next(err);
    }
});

/** POST /login { user }  => { user, token }
 *
 * Logs user into site, returns token.
 *
 * This returns the logged in user and an authentication token for them:
 *  {user: { id, username, firstName, lastName, email, isAdmin }, token }
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
        return res.status(201).json({ user, token });
    } catch (err) {
        return next(err);
    }
});

/** post /feedback => {}
 * 
 * Register user feedback
 * 
 * open to any/all a**h*... on the internet!
 */

router.post('/feedback', async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userFeedbackSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const feedback = await User.feedback();
        return res.json({ feedback });
    } catch (err) {
        return next(err);
    }
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
 * admin or same-user-as-:username
 **/

router.get("/username/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const users = await User.get(req.params.username);
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

// /**
//  * returns all users that have made one or more comments
//  * 
//  * returns [{ id, username, userFirst, userLast, email, isAdmin, icon }, ...]
//  * 
//  * admin only
//  */

// router.get('/comments', ensureAdmin, async function (req, res, next) {
//     try {
//         const users = await User.hasComments();
//         return res.json({ users });
//     } catch (err) {
//         return next(err);
//     }
// });

/** GET /[username] => password reset redirect
 * 
 * Password reset functionality
 * 
 * admin or same-user-as-:username
 */

router.get("/:username/forgotPassword", ensureCorrectUserOrAdmin, async function (req, res, next) {

});


/** PATCH /[id] { user } => { users }
 *
 * Data can include:
 *   { userFirst, userLast, email, username, password, icon }
 *
 * Returns { userFirst, userLast, email, username, isAdmin, icon }
 *
 * admin or same-user-as-:username
 **/

router.patch("/:id", ensureCorrectUserOrAdmin, upload.single('icon'), async function (req, res, next) {
    console.log('req.body', req.body);
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

        const users = await User.update(req.params.id, req.body, icon);
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