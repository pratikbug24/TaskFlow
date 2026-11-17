'use strict';

const express = require('express');
const bridge = require('../phpBridge');
const { asyncHandler } = require('../middleware');

const router = express.Router();

/** Forward a data-layer action, preserving its status and envelope. */
async function forward(res, action, payload, userId) {
  const { status, body } = await bridge.invoke(action, payload, userId);
  return res.status(status).json(body);
}

router.get('/', asyncHandler(async (req, res) => {
  return forward(res, 'todos.list', req.query, req.userId);
}));

router.post('/', asyncHandler(async (req, res) => {
  return forward(res, 'todos.create', req.body || {}, req.userId);
}));

// Declared before /:id so "clear-completed" is not treated as an id.
router.post('/clear-completed', asyncHandler(async (req, res) => {
  return forward(res, 'todos.clear-completed', {}, req.userId);
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  const payload = { ...(req.body || {}), id: Number(req.params.id) };
  return forward(res, 'todos.update', payload, req.userId);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  return forward(res, 'todos.delete', { id: Number(req.params.id) }, req.userId);
}));

module.exports = router;
