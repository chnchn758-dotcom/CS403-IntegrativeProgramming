require('dotenv').config();

const pool = require('./config/database');
const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

const PORT = 3000;

// Needed so req.body is populated for /auth/register, /auth/login, etc.
app.use(express.json());

// Test database connection
pool.query('SELECT NOW()')
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch(error => {
    console.error('Database connection failed:', error.message);
  });

// A basic route
app.get('/', (req, res) => {
  res.send('Hello, World! Express is working.');
});

// Auth + protected routes: /auth/register, /auth/login, /auth/refresh,
// /auth/logout, /profile, /admin/users
app.use(authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});