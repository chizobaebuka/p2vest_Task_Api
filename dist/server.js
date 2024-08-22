"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = __importDefault(require("./db/sequelize"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const task_route_1 = __importDefault(require("./routes/task.route"));
const models_1 = require("./db/models");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware setup
app.use(express_1.default.json()); // For parsing application/json
app.use((0, cors_1.default)()); // Enable CORS for cross-origin requests
app.use('/api/auth', auth_route_1.default); // Use the auth routes
app.use('/api/task', task_route_1.default); // Use the task routes
// Define routes here
function initializeModels() {
    // Ensure all models are associated
    Object.keys(models_1.models).forEach((modelName) => {
        if ('associate' in models_1.models[modelName]) {
            models_1.models[modelName].associate(models_1.models);
        }
    });
}
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize_1.default.authenticate();
            console.log('Database connection has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });
}
// Test database connection
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // initializeModels(); // Set up model associations
            yield sequelize_1.default.sync(); // Sync the database
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
                testConnection(); // Optionally test the database connection when the server starts
            });
        }
        catch (error) {
            console.error('Error starting the server:', error);
        }
    });
}
startServer();
