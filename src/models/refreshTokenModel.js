const crypto = require('crypto');
const pool = require('../config/database');

// We never store the raw refresh token (same reasoning as passwords: if the
// refresh_tokens table ever leaks, the tokens inside it shouldn't be usable
// as-is). We hash it and compare hashes instead.
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function store(userId, token, expiresAt) {
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, hashToken(token), expiresAt]
  );
}

// Returns the row if this exact token is on file and not revoked/expired.
async function findValid(userId, token) {
  const result = await pool.query(
    `SELECT id, expires_at, revoked FROM refresh_tokens
     WHERE user_id = $1 AND token_hash = $2 AND revoked = FALSE AND expires_at > NOW()`,
    [userId, hashToken(token)]
  );
  return result.rows[0] || null;
}

// Used on logout, and on refresh-token rotation (slide 28: "old refresh
// token is invalidated and replaced").
async function revoke(userId, token) {
  await pool.query(
    `UPDATE refresh_tokens SET revoked = TRUE
     WHERE user_id = $1 AND token_hash = $2`,
    [userId, hashToken(token)]
  );
}

// Used if we ever detect suspicious reuse of an already-rotated token
// (slide 28: "suspicious reuse can trigger session revocation").
async function revokeAllForUser(userId) {
  await pool.query(
    'UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1',
    [userId]
  );
}

module.exports = { store, findValid, revoke, revokeAllForUser };
