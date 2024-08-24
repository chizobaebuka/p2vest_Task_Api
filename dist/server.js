"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sequelize_1 = __importDefault(require("./db/sequelize"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const task_route_1 = __importDefault(require("./routes/task.route"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
const tag_route_1 = __importDefault(require("./routes/tag.route"));
const redis_client_1 = require("./db/redis.client");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server);
// Socket.io setup
exports.io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
// Middleware setup
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Route setup
app.use('/api/auth', auth_route_1.default);
app.use('/api/task', task_route_1.default);
app.use('/api/comment', comment_route_1.default);
app.use('/api/tag', tag_route_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
async function testConnection() {
    try {
        await sequelize_1.default.authenticate();
        console.log('Database connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
async function startServer() {
    try {
        await sequelize_1.default.sync();
        await (0, redis_client_1.connectClient)();
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            testConnection();
        });
    }
    catch (error) {
        console.error('Error starting the server:', error);
    }
}
async function shutdown() {
    console.log('Shutting down...');
    try {
        await (0, redis_client_1.closeClient)();
        await sequelize_1.default.close();
    }
    catch (err) {
        console.error('Error during shutdown:', err);
    }
    process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
startServer();
