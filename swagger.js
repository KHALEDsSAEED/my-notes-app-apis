import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition for the API documentation
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My Notes API',
            version: '1.0.0',
            description: 'API documentation for the My Notes application',
        },
        servers: [
            {
                url: 'https://my-notes-app-apis.onrender.com/',
                description: 'Production server',
            },
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    // Path to the API routes and models
    apis: ['./api/routes/*.js', './api/models/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Export the swagger documentation 
export default (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};