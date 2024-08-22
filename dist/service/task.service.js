"use strict";
// src/service/task.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = require("../repository/task.repository");
const uuid_1 = require("uuid");
const taskmodel_1 = __importDefault(require("../db/models/taskmodel"));
const usermodel_1 = __importDefault(require("../db/models/usermodel"));
const tag_repository_1 = require("../repository/tag.repository");
class TaskService {
    constructor() {
        this.taskRepo = new task_repository_1.TaskRepository();
        this.tagRepo = new tag_repository_1.TagRepository();
    }
    async createTask(taskData, userId) {
        const taskToCreate = Object.assign(Object.assign({}, taskData), { createdById: userId, id: (0, uuid_1.v4)(), status: taskData.status || 'Pending' });
        return await this.taskRepo.createTask(taskToCreate);
    }
    async assignTask(taskId, assignedToId) {
        const task = await this.taskRepo.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        // Validate the assigned user exists
        const assignedUser = await usermodel_1.default.findByPk(assignedToId);
        if (!assignedUser) {
            throw new Error('Assigned user does not exist');
        }
        task.assignedToId = assignedToId;
        task.status = 'In Progress'; // Change status to In Progress once assigned
        await task.save();
        return task;
    }
    async updateTaskStatus(taskId, status, userId, userRole) {
        const task = await this.taskRepo.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        // Check if the user is allowed to update the task status
        if (userRole !== 'Admin' && task.createdById !== userId) {
            throw new Error('Forbidden: Not authorized to update this task');
        }
        // Update the task status
        task.status = status;
        await task.save();
        return task;
    }
    async addTagsToTask(taskId, tagIds) {
        // Fetch the task and tags to ensure they exist
        const task = await taskmodel_1.default.findOne({
            where: { id: taskId },
            include: [{ model: usermodel_1.default, as: 'creator' }],
        });
        if (!task)
            return null;
        const tags = await Promise.all(tagIds.map(id => this.tagRepo.getTagById(id)));
        console.log({ tags });
        // Filter out null values
        const validTags = tags.filter((tag) => tag !== null);
        console.log({ validTags });
        if (validTags.length === 0)
            return null;
        // Associate each tag with the task individually
        for (const tag of validTags) {
            await task.addTags(tag);
        }
        return task;
    }
}
exports.TaskService = TaskService;
