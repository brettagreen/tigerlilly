"use strict";
/**
 * @module /backend/app
 * @requires module:express
 * @requires module:cors
 * @requires module:helmet
 * @requires module:/backend/expressError.NotFoundError
 * @requires module:/backend/middleware/auth.authenticateJWT
 * @requires module:/backend/routes/articles
 * @requires module:/backend/routes/users
 * @requires module:/backend/routes/comments
 * @requires module:/backend/routes/issues
 * @requires module:/backend/routes/authors
 * @requires module:/backend/routes/keywords
 * @requires module:morgan
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @description creates express application, configures various middleware incl. express router routes Modules and error handlers.
 * 
 */

/**
 * express module
 * @const
 */
const express = require("express");
/**
 * security: cross-origin requests module
 * @const
 */
const cors = require("cors");
/**
 * security: helmet module
 * @const
 */
const helmet = require("helmet");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");

/**
 * /backend/routes/articles module
 * @const
 */
const articlesRoutes = require("./routes/articles");
/**
 * /backend/routes/users module
 * @const
 */
const usersRoutes = require("./routes/users");
/**
 * /backend/routes/comments module
 * @const
 */
const commentsRoutes = require("./routes/comments");
/**
 * /backend/routes/issues module
 * @const
 */
const issuesRoutes = require("./routes/issues");
/**
 * /backend/routes/authors module
 * @const
 */
const authorsRoutes = require("./routes/authors");
/**
 * /backend/routes/keywords module
 * @const
 */
const keywordsRoutes = require("./routes/keywords");

/**
 * logging middleware
 * @const
 */
const morgan = require("morgan");

/**
 * express app object
 * @const
 */
const app = express();

/**
 * associate middleware with app object
 */
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/articles", articlesRoutes);
app.use("/users", usersRoutes);
app.use("/comments", commentsRoutes);
app.use("/issues", issuesRoutes);
app.use("/authors", authorsRoutes);
app.use("/keywords", keywordsRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({ error: { message, status }});
});

/**
 * imported by /backend/server module
 */
module.exports = app;
