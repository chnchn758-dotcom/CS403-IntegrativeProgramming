const authService = require('../services/authService');
const userModel = require('../models/userModel');
const { validateRegister, validateLogin } = require('../validations/authValidation');

async function register(req, res) {
  console.log('1. Controller received:', req.body);
  const errors = validateRegister(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await authService.register(req.body);
    return res.status(201).json({ user });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
}

async function login(req, res) {
  console.log('1. Login attempt for:', req.body.email);
  const errors = validateLogin(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    return res.status(200).json({ user, accessToken, refreshToken });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required.' });
  }

  try {
    const result = await authService.refresh(refreshToken);
    return res.status(200).json({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
}

async function logout(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required.' });
  }

  try {
    // req.user comes from requireAuth, so this endpoint needs a valid
    // access token AND the refresh token being logged out, matching it
    // to that same user.
    await authService.logout(req.user.id, refreshToken);
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
}

// Small protected route used to prove the whole flow works end-to-end.
async function profile(req, res) {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.status(200).json({ user });
}

module.exports = { register, login, refresh, logout, profile };
