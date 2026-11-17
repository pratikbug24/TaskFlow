'use strict';

const express = require('express');
const bridge = require('../phpBridge');
const { asyncHandler } = require('../middleware');

const router = express.Router();

router.get('/tables', asyncHandler(async (req, res) => {
  const { status, body } = await bridge.invoke('database.tables', {}, req.userId);
  return res.status(status).json(body);
}));

router.get('/tables/:name', asyncHandler(async (req, res) => {
  const { status, body } = await bridge.invoke('database.describe', { table: req.params.name }, req.userId);
  return res.status(status).json(body);
}));

router.get('/tables/:name/rows', asyncHandler(async (req, res) => {
  const payload = {
    table: req.params.name,
    limit: req.query.limit,
    offset: req.query.offset,
  };
  const { status, body } = await bridge.invoke('database.rows', payload, req.userId);
  return res.status(status).json(body);
}));

module.exports = router;
