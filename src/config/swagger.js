const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Group 11 Project API',
      version: '1.0.0',
      description: 'JWT-authenticated REST API with auth and pets endpoints, for CS403.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Tells swagger-jsdoc to scan these files for @swagger comment blocks
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
