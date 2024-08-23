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
const notification_service_1 = require("./notification.service");
const redis_client_1 = require("../db/redis.client");
const helper_1 = require("../utils/helper");
class TaskService {
    constructor() {
        this.taskRepo = new task_repository_1.TaskRepository();
        this.tagRepo = new tag_repository_1.TagRepository();
    }
    async createTask(taskData, userId) {
        const taskToCreate = Object.assign(Object.assign({}, taskData), { createdById: userId, id: (0, uuid_1.v4)(), status: taskData.status || 'Pending' });
        const task = await this.taskRepo.createTask(taskToCreate);
        await (0, helper_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
        return task;
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
        const message = `You have been assigned a new task: ${task.title}`;
        await notification_service_1.NotificationService.createNotification(assignedUser.id, taskId, 'task_assigned', message);
        await redis_client_1.client.publish('task_notifications', JSON.stringify({ userId: assignedUser.id, taskId, type: 'task_assigned', message }));
        await task.save();
        await (0, helper_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
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
        const message = `The status of task "${task.title}" has been updated to ${status}`;
        await notification_service_1.NotificationService.createNotification(task.assignedToId, taskId, 'task_status_updated', message);
        await (0, helper_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
        return task;
    }
    async addTagsToTask(taskId, tagIds) {
        // Fetch the task to ensure it exists
        const task = await taskmodel_1.default.findOne({
            where: { id: taskId },
        });
        if (!task) {
            return {
                message: "Failed to add tags to task",
                error: "Task not found",
            };
        }
        // Fetch the tags to ensure they exist
        const tags = await Promise.all(tagIds.map(id => this.tagRepo.getTagById(id)));
        // Filter out null values (i.e., non-existent tags)
        const validTags = tags.filter((tag) => tag !== null);
        if (validTags.length === 0) {
            return {
                message: "Failed to add tags to task",
                error: "No valid tags found",
            };
        }
        // Since `tagId` is not designed to hold multiple tags, we'll iterate over `validTags`
        // and update the task's `tagId` for each valid tag
        for (const tag of validTags) {
            await task.update({ tagId: tag.id });
        }
        await (0, helper_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
        return {
            message: "Tags successfully associated with task",
            task: task,
        };
    }
    async getAllTasksWithFilters(filters) {
        const cacheKey = `tasks:filters:${JSON.stringify(filters)}`;
        const cachedData = await (0, helper_1.getCachedData)(cacheKey);
        console.log({ cacheData: cachedData });
        if (cachedData) {
            console.log('Cache hit');
            return JSON.parse(cachedData);
        }
        const result = await this.taskRepo.getAllTasksWithFilters(filters);
        await (0, helper_1.cacheData)(cacheKey, JSON.stringify(result.data));
        return result.data;
    }
    async getAllTasks() {
        const cacheKey = 'tasks:all';
        const cachedData = await (0, helper_1.getCachedData)(cacheKey);
        console.log({ cachedData });
        if (cachedData) {
            console.log('Cache hit');
            return JSON.parse(cachedData);
        }
        console.log('Cache miss');
        const tasks = await this.taskRepo.getAllTasks();
        await (0, helper_1.cacheData)(cacheKey, JSON.stringify(tasks));
        return tasks;
    }
}
exports.TaskService = TaskService;
