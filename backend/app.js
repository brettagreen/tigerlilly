"use strict";

/** Express app for Tigerlilly */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const articlesRoutes = require("./routes/articles");
const usersRoutes = require("./routes/users");
const commentsRoutes = require("./routes/comments");
const issuesRoutes = require("./routes/issues");
const authorsRoutes = require("./routes/authors");
const keywordsRoutes = require("./routes/keywords");

const morgan = require("morgan");

const app = express();

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

module.exports = app;
