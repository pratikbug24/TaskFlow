'use strict';

/** Send the { ok: true, data } envelope the React client expects. */
function ok(res, data, status = 200) {
  res.status(status).json({ ok: true, data });
}

/** Send the { ok: false, error } envelope. */
function fail(res, message, status = 400) {
  res.status(status).json({ ok: false, error: message });
}

module.exports = { ok, fail };