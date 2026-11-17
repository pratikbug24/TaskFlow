'use strict';

require('dotenv').config();

const path = require('path');

const gatewayRoot = path.resolve(__dirname, '..');

module.exports = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-taskflow-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Absolute path to the PHP data-layer entry point.
  phpEntry: process.env.PHP_ENTRY || path.resolve(gatewayRoot, '..', 'php', 'index.php'),
  phpBinary: process.env.PHP_BINARY || 'php',
  // Database credentials forwarded to the PHP process.
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '3306',
    name: process.env.DB_NAME || 'taskflow',
    user: process.env.DB_USER || 'taskflow',
    password: process.env.DB_PASSWORD || 'taskflow_pass',
  },
};
