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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const validation_1 = require("../utils/validation");
const zod_1 = require("zod");
class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    // Create a new task
    createTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const taskData = validation_1.createTaskSchema.parse(req.body);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(400).json({ error: 'User not authenticated' });
                }
                const newTask = yield this.taskService.createTask(taskData, userId);
                return res.status(201).json({ message: 'Task created successfully', task: newTask });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return res.status(400).json({ error: 'Validation error', details: error.errors });
                }
                return res.status(400).json({ error: 'Error creating task: ' + error.message });
            }
        });
    }
    // Assign a task to a user
    assignTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request parameters
                const { taskId, assignedToId } = validation_1.assignTaskSchema.parse({
                    taskId: req.params.taskId,
                    assignedToId: req.params.assignedToId,
                });
                // Ensure the assignedToId is valid and associated with a user
                if (!assignedToId) {
                    return res.status(400).json({ error: 'Assigned user ID is required' });
                }
                // Call service method to assign task
                const updatedTask = yield this.taskService.assignTask(taskId, assignedToId);
                return res.status(200).json({ message: 'Task assigned successfully', task: updatedTask });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return res.status(400).json({ error: 'Validation error', details: error.errors });
                }
                return res.status(400).json({ error: 'Error assigning task: ' + error.message });
            }
        });
    }
    updateTaskStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { taskId, status } = validation_1.updateTaskStatusSchema.parse({
                    taskId: req.params.taskId,
                    status: req.body.status // Ensure status is treated as TaskStatus
                });
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
                const updatedTask = yield this.taskService.updateTaskStatus(taskId, status, userId, userRole);
                return res.status(200).json({ message: 'Task status updated successfully', task: updatedTask });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return res.status(400).json({ error: 'Validation error', details: error.errors });
                }
                return res.status(400).json({ error: 'Error updating task status: ' + error.message });
            }
        });
    }
}
exports.TaskController = TaskController;
