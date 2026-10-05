require("dotenv").config();

const pool = require("./config/database");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const PORT = 3000;

app.use(express.json());

pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

// A basic route
app.get("/", (req, res) => {
  res.send("Hello, World! Express is working.");
});

// Auth + protected routes: /auth/register, /auth/login, /auth/refresh,
// /auth/logout, /profile, /admin/users
app.use(authRoutes);
app.use(petRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Catch any request that didn't match a route above (e.g. a typo'd URL)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Must be registered LAST — catches anything thrown or rejected anywhere above
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
