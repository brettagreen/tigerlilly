/**
 * @module /backend/expressError
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @description ExpressError extends normal JS error so we can add a status when we make an instance of it.
 * The error-handling middleware will return this.
 */

/**
 * @param {string} message - the error message
 * @param {number} status - the error code
 * @class
 * @classdesc ExpressError is a child of Error class
 * @description generic application error
 */
class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
  }
}

/**
 * @param {string='Not Found'} message - the error message
 * @class
 * @classdesc 404 NOT FOUND error, 404 error code
 */
class NotFoundError extends ExpressError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

/**
 * @param {string='Unauthorized'} message - the error message
 * @class
 * @classdesc 401 UNAUTHORIZED error, 401 error code
 */
class UnauthorizedError extends ExpressError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/**
 * @param {string='Bad Request'} message - the error message
 * @class
 * @classdesc 400 BAD REQUEST error, 400 error code
 */
class BadRequestError extends ExpressError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

/**
 * @param {string='Bad Request'} message - the error message
 * @class
 * @classdesc 403 BAD REQUEST/FORBIDDEN error, 403 error code
 */
class ForbiddenError extends ExpressError {
  constructor(message = "Bad Request") {
    super(message, 403);
  }
}

module.exports = {
  ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
};