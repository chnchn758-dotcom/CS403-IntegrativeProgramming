const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const pool = require('../config/database');

const router = express.Router();

// Public
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refresh);

// Protected (needs a valid access token)
router.post('/auth/logout', requireAuth, authController.logout);
router.get('/profile', requireAuth, authController.profile);

// Admin-only, to mirror the practical exercise's role-check example
// (slide 21 / 32: GET /admin/users → admin role required).
router.get('/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
  res.status(200).json({ users: result.rows });
});

module.exports = router;
