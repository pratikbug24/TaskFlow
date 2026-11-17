'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bridge = require('../phpBridge');
const { asyncHandler, requireAuth } = require('../middleware');
const { ok } = require('../respond');

const router = express.Router();

/** Mint a JWT for a user id. */
function issueToken(userId) {
  return jwt.sign({ sub: String(userId) }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

/** Run a data-layer action and forward its status/body verbatim. */
async function callDataLayer(res, action, payload, userId = null) {
  const { status, body } = await bridge.invoke(action, payload, userId);
  return res.status(status).json(body);
}

router.post('/register', asyncHandler(async (req, res) => {
  const { status, body } = await bridge.invoke('auth.register', req.body || {});
  if (!body.ok) {
    return res.status(status).json(body);
  }
  const token = issueToken(body.data.user.id);
  return ok(res, { token, ...body.data }, 201);
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { status, body } = await bridge.invoke('auth.login', req.body || {});
  if (!body.ok) {
    return res.status(status).json(body);
  }
  const token = issueToken(body.data.user.id);
  return ok(res, { token, ...body.data });
}));

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  return callDataLayer(res, 'auth.me', {}, req.userId);
}));

module.exports = router;
