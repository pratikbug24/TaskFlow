'use strict';

const express = require('express');
const cors = require('cors');

const config = require('./config');
const { requireAuth, errorHandler } = require('./middleware');
const { ok } = require('./respond');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const profileRoutes = require('./routes/profile');
const settingsRoutes = require('./routes/settings');
const databaseRoutes = require('./routes/database');

const app = express();

app.use(cors());
app.use(express.json({ limit: '256kb' }));

// Unauthenticated health probe.
app.get('/api/health', (req, res) => ok(res, { status: 'up', service: 'taskflow-gateway' }));

// Public auth endpoints (register / login / me).
app.use('/api/auth', authRoutes);

// Everything below requires a valid bearer token.
app.use('/api/todos', requireAuth, todoRoutes);
app.use('/api/profile', requireAuth, profileRoutes);
app.use('/api/settings', requireAuth, settingsRoutes);
app.use('/api/database', requireAuth, databaseRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: `No route for ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`TaskFlow gateway listening on http://localhost:${config.port}`);
    console.log(`PHP data layer: ${config.phpEntry}`);
  });
}

module.exports = app;
