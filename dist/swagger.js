"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// Define the swaggerDefinition using the correct type
const swaggerDefinition = {
    swagger: '2.0', // This should match the Swagger version you're using
    info: {
        title: 'Multi User Task Management API',
        version: '1.0.0',
        description: 'A simple API to manage tasks for multiple users',
    },
    paths: {},
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    },
    definitions: {
        UserModel: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'The ID of the user model table'
                },
                firstName: {
                    type: 'string',
                    description: 'The first name of the user'
                },
                lastName: {
                    type: 'string',
                    description: 'The last name of the user'
                },
                email: {
                    type: 'string',
                    description: 'The email of the user'
                },
                password: {
                    type: 'string',
                    description: 'The password of the user'
                },
                role: {
                    type: 'string',
                    enum: ["Admin", "Regular"],
                    description: 'The role of the user'
                },
                createdAt: {
                    type: 'string',
                    description: 'The date the user was created'
                },
                updatedAt: {
                    type: 'string',
                    description: 'The date the user was last updated'
                },
                deletedAt: {
                    type: 'string',
                    description: 'The deletedAt column of the user model'
                },
            }
        }
    }
};
const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.ts"],
};
const swaggerSpecs = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpecs;
