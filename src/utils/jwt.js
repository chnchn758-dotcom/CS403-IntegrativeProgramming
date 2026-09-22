const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  // Fail loudly at startup rather than silently signing with "undefined".
  throw new Error(
    'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in .env'
  );
}

// Short-lived token the client sends on every request (slide 14/15).
function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    ACCESS_SECRET,
    {
      expiresIn: ACCESS_EXPIRES_IN,
      issuer: 'group11-api',
      audience: 'group11-client',
      algorithm: 'HS256',
    }
  );
}

// Longer-lived token used only to mint new access tokens (slide 14/28).
function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id },
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_EXPIRES_IN,
      issuer: 'group11-api',
      audience: 'group11-client',
      algorithm: 'HS256',
    }
  );
}

// Explicitly pin the algorithm on verify too (slide 17: "never accept an
// arbitrary algorithm supplied by an attacker").
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET, {
    algorithms: ['HS256'],
    issuer: 'group11-api',
    audience: 'group11-client',
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET, {
    algorithms: ['HS256'],
    issuer: 'group11-api',
    audience: 'group11-client',
  });
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
