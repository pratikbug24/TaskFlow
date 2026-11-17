'use strict';

const { spawn } = require('child_process');
const config = require('./config');

/**
 * Invokes the PHP data layer once per call, passing a JSON request on stdin and
 * reading a JSON envelope back from stdout:
 *
 *   request  -> { action, payload, userId }
 *   response <- { status, body: { ok, data } | { ok: false, error } }
 *
 * The gateway is the only component that knows the data layer runs in PHP, so
 * the transport can be swapped without touching the routes.
 */
function invoke(action, payload = {}, userId = null) {
  return new Promise((resolve, reject) => {
    const child = spawn(config.phpBinary, [config.phpEntry], {
      env: {
        ...process.env,
        DB_HOST: config.db.host,
        DB_PORT: String(config.db.port),
        DB_NAME: config.db.name,
        DB_USER: config.db.user,
        DB_PASSWORD: config.db.password,
      },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });

    child.on('error', (error) => {
      reject(Object.assign(new Error(`Failed to start PHP: ${error.message}`), { status: 500 }));
    });

    child.on('close', (code) => {
      if (code !== 0 && !stdout.trim()) {
        return reject(Object.assign(new Error(`PHP exited with code ${code}: ${stderr.trim()}`), { status: 500 }));
      }

      let parsed;
      try {
        parsed = JSON.parse(stdout);
      } catch {
        return reject(Object.assign(new Error('Malformed response from data layer'), { status: 500 }));
      }

      resolve({ status: parsed.status || 200, body: parsed.body });
    });

    child.stdin.write(JSON.stringify({ action, payload, userId }));
    child.stdin.end();
  });
}

module.exports = { invoke };
