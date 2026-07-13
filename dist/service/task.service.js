"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = require("../repository/task.repository");
const uuid_1 = require("uuid");
const usermodel_1 = __importDefault(require("../db/models/usermodel"));
const tag_repository_1 = require("../repository/tag.repository");
const notification_service_1 = require("./notification.service");
const redis_client_1 = require("../db/redis.client");
const server_1 = require("../server");
const sequelize_1 = __importDefault(require("../db/sequelize"));
class TaskService {
    constructor() {
        this.taskRepo = new task_repository_1.TaskRepository();
        this.tagRepo = new tag_repository_1.TagRepository();
    }
    // Cache is a write-through, best-effort accelerator for reads. It must
    // never be consulted to decide whether a write happens, and every
    // mutation must invalidate it so reads can't observe stale data forever.
    async invalidateTaskCaches(taskId) {
        await Promise.all([
            (0, redis_client_1.deleteCachedData)(`task:${taskId}`),
            (0, redis_client_1.deleteCachedData)(`task_status:${taskId}`),
            (0, redis_client_1.deleteCachedData)('tasks:all'),
        ]);
    }
    async createTask(taskData, userId) {
        const taskToCreate = Object.assign(Object.assign({}, taskData), { createdById: userId, id: (0, uuid_1.v4)(), status: taskData.status || 'Pending' });
        const task = await this.taskRepo.createTask(taskToCreate);
        console.log(`Task created with ID: ${task.id}`);
        await this.invalidateTaskCaches(task.id);
        try {
            await (0, redis_client_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
        }
        catch (error) {
            console.error('Error caching task data:', error);
        }
        return task;
    }
    async assignTask(taskId, assignedToId, userId, userRole) {
        const assignedUser = await usermodel_1.default.findByPk(assignedToId);
        if (!assignedUser) {
            throw new Error('Assigned user does not exist');
        }
        const task = await sequelize_1.default.transaction(async (t) => {
            const task = await this.taskRepo.findByIdForUpdate(taskId, t);
            if (!task) {
                throw new Error('Task not found');
            }
            if (userRole !== 'Admin' && task.createdById !== userId) {
                throw new Error('Forbidden: Not authorized to assign this task');
            }
            task.assignedToId = assignedUser.id;
            task.status = 'In Progress';
            await task.save({ transaction: t });
            const message = `You have been assigned a new task: ${task.title}`;
            await notification_service_1.NotificationService.createNotification(assignedUser.id, taskId, 'task_assigned', message, t);
            return task;
        });
        server_1.io.emit('task_assigned', task.title, task.assignedToId);
        await this.invalidateTaskCaches(task.id);
        try {
            await (0, redis_client_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
        }
        catch (error) {
            console.error('Error caching task data:', error);
        }
        return task;
    }
    async updateTaskStatus(taskId, status, userId, userRole) {
        const task = await sequelize_1.default.transaction(async (t) => {
            const task = await this.taskRepo.findByIdForUpdate(taskId, t);
            if (!task) {
                throw new Error('Task not found');
            }
            if (userRole !== 'Admin' && task.createdById !== userId) {
                throw new Error('Forbidden: Not authorized to update this task');
            }
            task.status = status;
            await task.save({ transaction: t });
            // A task may not have an assignee yet (e.g. its creator changes
            // its status before assigning it) - only notify if there's
            // someone to notify.
            if (task.assignedToId) {
                const message = `The status of task "${task.title}" has been updated to ${status}`;
                await notification_service_1.NotificationService.createNotification(task.assignedToId, taskId, 'task_status_updated', message, t);
            }
            return task;
        });
        server_1.io.emit('task_updated', task.title, userId);
        await this.invalidateTaskCaches(task.id);
        try {
            await (0, redis_client_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
        }
        catch (error) {
            console.error('Error caching task data:', error);
        }
        return task;
    }
    async addTagsToTask(taskId, tagIds) {
        const task = await sequelize_1.default.transaction(async (t) => {
            const task = await this.taskRepo.findByIdForUpdate(taskId, t);
            if (!task) {
                throw new Error('Task not found');
            }
            const tags = await Promise.all(tagIds.map(id => this.tagRepo.getTagById(id)));
            const validTags = tags.filter((tag) => tag !== null);
            if (validTags.length === 0) {
                throw new Error('No valid tags found');
            }
            // Only attach tags not already associated, so retrying this call
            // is idempotent instead of relying on catching unique-constraint errors.
            const existingTags = await task.getTags({ transaction: t });
            const existingTagIds = new Set(existingTags.map(tag => tag.id));
            const newTags = validTags.filter(tag => !existingTagIds.has(tag.id));
            if (newTags.length > 0) {
                await this.taskRepo.addTagsToTask(task, newTags, t);
            }
            return task;
        });
        await this.invalidateTaskCaches(task.id);
        try {
            await (0, redis_client_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
        }
        catch (error) {
            console.error('Error caching updated task data:', error);
        }
        return task;
    }
    async getAllTasksWithFilters(filters) {
        const cacheKey = `tasks:filters:${JSON.stringify(filters)}`;
        let cachedData;
        try {
            cachedData = await (0, redis_client_1.getCachedData)(cacheKey);
        }
        catch (error) {
            console.error('Error retrieving cached data:', error);
            cachedData = null;
        }
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        let result;
        try {
            result = await this.taskRepo.getAllTasksWithFilters(filters);
        }
        catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch tasks from repository');
        }
        // This cache key is one of many possible filter permutations; it is
        // deliberately left to expire via TTL rather than actively
        // invalidated on every task mutation (see invalidateTaskCaches).
        try {
            await (0, redis_client_1.cacheData)(cacheKey, JSON.stringify(result.data));
        }
        catch (error) {
            console.error('Error caching new data:', error);
        }
        return result.data;
    }
    async getAllTasks() {
        const cacheKey = 'tasks:all';
        let cachedData;
        try {
            cachedData = await (0, redis_client_1.getCachedData)(cacheKey);
        }
        catch (error) {
            console.error('Error retrieving cached data:', error);
            cachedData = null;
        }
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        let tasks;
        try {
            tasks = await this.taskRepo.getAllTasks();
        }
        catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch tasks from repository');
        }
        try {
            await (0, redis_client_1.cacheData)(cacheKey, JSON.stringify(tasks));
        }
        catch (error) {
            console.error('Error caching new data:', error);
        }
        return tasks;
    }
    async deleteTaskById(taskId) {
        const task = await this.taskRepo.findById(taskId);
        if (!task) {
            return false;
        }
        const result = await this.taskRepo.deleteTaskById(taskId);
        if (result === 0) {
            return false;
        }
        await this.invalidateTaskCaches(taskId);
        return true;
    }
    async getTaskById(taskId) {
        const cacheKey = `task:${taskId}`;
        try {
            const cachedData = await (0, redis_client_1.getCachedData)(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        }
        catch (error) {
            console.error('Error retrieving cached data:', error);
        }
        let task;
        try {
            task = await this.taskRepo.findById(taskId);
            if (!task) {
                return null;
            }
        }
        catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch task from repository');
        }
        try {
            await (0, redis_client_1.cacheData)(cacheKey, JSON.stringify(task));
        }
        catch (error) {
            console.error('Error caching new data:', error);
        }
        return task;
    }
}
exports.TaskService = TaskService;
