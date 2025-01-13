import swaggerJSDoc from 'swagger-jsdoc';

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Example API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    servers: [
      {
        url: 'https://to-do-list-api-production-28bb.up.railway.app/',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;