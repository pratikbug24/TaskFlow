'use strict';

const express = require('express');
const bridge = require('../phpBridge');
const { asyncHandler } = require('../middleware');

const router = express.Router();

router.get('/stats', asyncHandler(async (req, res) => {
  const { status, body } = await bridge.invoke('profile.stats', {}, req.userId);
  return res.status(status).json(body);
}));

router.patch('/', asyncHandler(async (req, res) => {
  const { status, body } = await bridge.invoke('profile.update', req.body || {}, req.userId);
  return res.status(status).json(body);
}));

module.exports = router;
