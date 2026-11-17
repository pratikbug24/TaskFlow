'use strict';

const express = require('express');
const bridge = require('../phpBridge');
const { asyncHandler } = require('../middleware');

const router = express.Router();

router.patch('/', asyncHandler(async (req, res) => {
  const { status, body } = await bridge.invoke('settings.update', req.body || {}, req.userId);
  return res.status(status).json(body);
}));

module.exports = router;
