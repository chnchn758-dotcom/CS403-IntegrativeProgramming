const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const refreshTokenModel = require('../models/refreshTokenModel');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days, matches jwt.js default

async function register({ name, email, password }) {
  console.log('2. Hashing password...');
  const existing = await userModel.findByEmail(email);
  if (existing) {
    const error = new Error('An account with this email already exists.');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  console.log('3. Password hashed to:', passwordHash);
  const user = await userModel.createUser({ name, email, passwordHash });
  return user; // never includes password_hash
}

async function login({ email, password }) {
  const user = await userModel.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  const accessToken = signAccessToken(safeUser);
  const refreshToken = signRefreshToken(safeUser);
  console.log('4. Access token created:', accessToken);
  console.log('5. Refresh token created:', refreshToken);

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await refreshTokenModel.store(user.id, refreshToken, expiresAt);

  return { user: safeUser, accessToken, refreshToken };
}

async function refresh(oldRefreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch (err) {
    const error = new Error('Refresh token is invalid or expired.');
    error.status = 401;
    throw error;
  }

  const stored = await refreshTokenModel.findValid(payload.sub, oldRefreshToken);
  if (!stored) {
    // Either never issued, already used (rotated away), or revoked.
    // Treat as suspicious reuse and kill every session for this user
    // (slide 28: "suspicious reuse can trigger session revocation").
    await refreshTokenModel.revokeAllForUser(payload.sub);
    const error = new Error('Refresh token is invalid or has already been used.');
    error.status = 401;
    throw error;
  }

  const user = await userModel.findById(payload.sub);
  if (!user) {
    const error = new Error('User no longer exists.');
    error.status = 401;
    throw error;
  }

  // Rotation: invalidate the old refresh token and issue a brand new one.
  await refreshTokenModel.revoke(payload.sub, oldRefreshToken);

  const accessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await refreshTokenModel.store(user.id, newRefreshToken, expiresAt);

  return { user, accessToken, refreshToken: newRefreshToken };
}

async function logout(userId, refreshToken) {
  // Revoking the refresh token is what actually ends the session server-side.
  // The access token stays valid until it naturally expires (it's short-lived
  // by design - see slide 27, "Logout and Revocation").
  await refreshTokenModel.revoke(userId, refreshToken);
}

module.exports = { register, login, refresh, logout };
