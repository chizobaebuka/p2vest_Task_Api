"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = __importDefault(require("./db/sequelize"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const task_route_1 = __importDefault(require("./routes/task.route"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
const tag_route_1 = __importDefault(require("./routes/tag.route"));
const models_1 = require("./db/models");
const redis_client_1 = require("./db/redis.client");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware setup
app.use(express_1.default.json()); // For parsing application/json
app.use((0, cors_1.default)()); // Enable CORS for cross-origin requests
app.use('/api/auth', auth_route_1.default); // Use the auth routes
app.use('/api/task', task_route_1.default); // Use the task routes
app.use('/api/comment', comment_route_1.default); // Use the comment routes
app.use('/api/tag', tag_route_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Define routes here
function initializeModels() {
    // Ensure all models are associated
    Object.keys(models_1.models).forEach((modelName) => {
        if ('associate' in models_1.models[modelName]) {
            models_1.models[modelName].associate(models_1.models);
        }
    });
}
async function testConnection() {
    try {
        await sequelize_1.default.authenticate();
        console.log('Database connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
// Start the server
async function startServer() {
    try {
        await sequelize_1.default.sync(); // Sync the database
        // Connect to Redis
        await (0, redis_client_1.connectClient)();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            testConnection(); // Optionally test the database connection when the server starts
        });
    }
    catch (error) {
        console.error('Error starting the server:', error);
    }
}
// Handle shutdown
async function shutdown() {
    console.log('Shutting down...');
    try {
        await (0, redis_client_1.closeClient)(); // Close Redis connection
        await sequelize_1.default.close(); // Close database connection
    }
    catch (err) {
        console.error('Error during shutdown:', err);
    }
    process.exit(0); // Exit process
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
startServer();
