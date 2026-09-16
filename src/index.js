require('dotenv').config();

const pool = require('./config/database');
const express = require('express');

const app = express();

const PORT = 3000;

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});