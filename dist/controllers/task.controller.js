"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const validation_1 = require("../utils/validation");
const zod_1 = require("zod");
class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    // Create a new task
    async createTask(req, res) {
        var _a;
        try {
            const taskData = validation_1.createTaskSchema.parse(req.body);
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(400).json({ error: 'User not authenticated' });
            }
            const newTask = await this.taskService.createTask(taskData, userId);
            return res.status(201).json({ message: 'Task created successfully', task: newTask });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: 'Validation error', details: error.errors });
            }
            return res.status(400).json({ error: 'Error creating task: ' + error.message });
        }
    }
    // Assign a task to a user
    async assignTask(req, res) {
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
            const updatedTask = await this.taskService.assignTask(taskId, assignedToId);
            return res.status(200).json({ message: 'Task assigned successfully', task: updatedTask });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: 'Validation error', details: error.errors });
            }
            return res.status(400).json({ error: 'Error assigning task: ' + error.message });
        }
    }
    async updateTaskStatus(req, res) {
        var _a, _b;
        try {
            const { taskId, status } = validation_1.updateTaskStatusSchema.parse({
                taskId: req.params.taskId,
                status: req.body.status // Ensure status is treated as TaskStatus
            });
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            const updatedTask = await this.taskService.updateTaskStatus(taskId, status, userId, userRole);
            return res.status(200).json({ message: 'Task status updated successfully', task: updatedTask });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: 'Validation error', details: error.errors });
            }
            return res.status(400).json({ error: 'Error updating task status: ' + error.message });
        }
    }
    async addTagsToTask(req, res) {
        try {
            // Validate the request body using Zod schema
            const { taskId, tagIds } = validation_1.addTagsToTaskSchema.parse(req.body);
            const task = await this.taskService.addTagsToTask(taskId, tagIds);
            if (!task) {
                return res.status(404).json({ message: 'Task or Tags not found' });
            }
            return res.status(200).json({ message: 'Tags added to task successfully', task });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: 'Validation error', details: error.errors });
            }
            return res.status(500).json({ message: 'Failed to add tags to task', error: error.message });
        }
    }
}
exports.TaskController = TaskController;
