import swaggerJsdoc from 'swagger-jsdoc';
import { APP_URL } from './env';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API Documentation',
            version: '1.0.0',
            description: 'Dokumentasi lengkap API E-Commerce',
            contact: {
                name: 'Backend Developer',
            },
        },
        servers: [
            {
                url: `${APP_URL}/api/v1`,
                description: 'API Server',
            },
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
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // PENTING: Tentukan file mana yang mengandung anotasi Swagger
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;