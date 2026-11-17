'use strict';

const jwt = require('jsonwebtoken');
const config = require('./config');
const { fail } = require('./respond').default;

/** Wraps an async route so rejected promises reach the error handler. */
function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

/** Verifies the bearer token and attaches req.userId, or responds 401. */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return fail(res, 'Authentication required', 401);
  }

  try {
    const claims = jwt.verify(token, config.jwtSecret);
    req.userId = Number(claims.sub);
    return next();
  } catch {
    return fail(res, 'Your session has expired, please sign in again', 401);
  }
}

/** Central error handler — keeps the JSON envelope consistent. */
// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  if (status >= 500) {
    console.error('[gateway]', error.message);
  }
  return fail(res, error.message || 'Something went wrong', status);
}

module.exports = { asyncHandler, requireAuth, errorHandler };
