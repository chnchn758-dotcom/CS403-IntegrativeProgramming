const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const pool = require('../config/database');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test User
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error (missing/invalid fields)
 *       409:
 *         description: Email already registered
 */
router.post('/auth/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in and receive an access/refresh token pair
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Returns user info, accessToken, and refreshToken
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 */
router.post('/auth/login', authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Exchange a refresh token for a new access/refresh token pair
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a new accessToken and refreshToken
 *       400:
 *         description: refreshToken is required
 *       401:
 *         description: Refresh token is invalid, expired, or already used
 */
router.post('/auth/refresh', authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out by revoking a refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       400:
 *         description: refreshToken is required
 *       401:
 *         description: Missing or invalid access token
 */
router.post('/auth/logout', requireAuth, authController.logout);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the current user's info
 *       401:
 *         description: Missing or invalid access token
 */
router.get('/profile', requireAuth, authController.profile);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all users
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Logged-in user is not an admin
 */
router.get('/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
  res.status(200).json({ users: result.rows });
});

module.exports = router;