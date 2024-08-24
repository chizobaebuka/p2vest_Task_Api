"use strict";
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
const server_1 = require("../server");
class TaskService {
    constructor() {
        this.taskRepo = new task_repository_1.TaskRepository();
        this.tagRepo = new tag_repository_1.TagRepository();
    }
    async createTask(taskData, userId) {
        const taskToCreate = Object.assign(Object.assign({}, taskData), { createdById: userId, id: (0, uuid_1.v4)(), status: taskData.status || 'Pending' });
        let task;
        try {
            task = await this.taskRepo.createTask(taskToCreate);
            console.log(`Task created with ID: ${task.id}`);
        }
        catch (error) {
            console.error('Error creating task:', error);
            throw new Error('Error creating task');
        }
        // Cache the created task
        try {
            await (0, redis_client_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
            console.log(`Cached task with key: task:${task.id}`);
        }
        catch (error) {
            console.error('Error caching task data:', error);
        }
        return task;
    }
    async assignTask(taskId, assignedToId) {
        const task = await this.taskRepo.findById(taskId);
        if (!task) {
            console.error(`Task with ID ${taskId} not found.`);
            throw new Error('Task not found');
        }
        // Validate the assigned user exists
        const assignedUser = await usermodel_1.default.findByPk(assignedToId);
        if (!assignedUser) {
            console.error(`Assigned user with ID ${assignedToId} does not exist.`);
            throw new Error('Assigned user does not exist');
        }
        // Update task details
        task.assignedToId = assignedUser.id;
        task.status = 'In Progress';
        // Create a notification
        const message = `You have been assigned a new task: ${task.title}`;
        await notification_service_1.NotificationService.createNotification(assignedUser.id, taskId, 'task_assigned', message);
        server_1.io.emit('task_assigned', task.title, task.assignedToId);
        // Save the task
        try {
            await task.save();
        }
        catch (error) {
            console.error('Error saving task:', error);
        }
        // Cache the updated task
        try {
            await (0, redis_client_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
            console.log(`Cached task with key: task:${task.id}`);
        }
        catch (error) {
            console.error('Error caching task data:', error);
        }
        return task;
    }
    async updateTaskStatus(taskId, status, userId, userRole) {
        const cacheKey = `task_status:${taskId}`;
        console.log(`Retrieving cache for key: ${cacheKey}`);
        const cachedStatus = await (0, redis_client_1.getCachedData)(cacheKey);
        console.log(`Cached status: ${cachedStatus}`);
        if (!cachedStatus) {
            console.log('Cache miss. Updating status and caching the new value.');
            const task = await this.taskRepo.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            if (userRole !== 'Admin' && task.createdById !== userId) {
                throw new Error('Forbidden: Not authorized to update this task');
            }
            task.status = status;
            await task.save();
            const message = `The status of task "${task.title}" has been updated to ${status}`;
            await notification_service_1.NotificationService.createNotification(task.assignedToId, taskId, 'task_status_updated', message);
            server_1.io.emit('task_updated', task.title, userId);
            await (0, redis_client_1.cacheData)(cacheKey, JSON.stringify(task));
            return task;
        }
        return JSON.parse(cachedStatus);
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
        try {
            await (0, redis_client_1.cacheData)(`task:${task.id}`, JSON.stringify(task));
            console.log(`Cached updated task with key: task:${task.id}`);
        }
        catch (error) {
            console.error('Error caching updated task data:', error);
        }
        return {
            message: "Tags successfully associated with task",
            task: task,
        };
    }
    async getAllTasksWithFilters(filters) {
        const cacheKey = `tasks:filters:${JSON.stringify(filters)}`;
        console.log(`Cache key: ${cacheKey}`);
        // Attempt to retrieve cached data
        let cachedData;
        try {
            cachedData = await (0, redis_client_1.getCachedData)(cacheKey);
            console.log(`Retrieved cache data: ${cachedData}`);
        }
        catch (error) {
            console.error('Error retrieving cached data:', error);
            cachedData = null;
        }
        if (cachedData) {
            console.log('Cache hit: Returning cached data');
            return JSON.parse(cachedData);
        }
        console.log('Cache miss: Fetching data from repository');
        // Fetch data from repository
        let result;
        try {
            result = await this.taskRepo.getAllTasksWithFilters(filters);
        }
        catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch tasks from repository');
        }
        // Cache the newly fetched data
        try {
            await (0, redis_client_1.cacheData)(cacheKey, JSON.stringify(result.data));
            console.log('Cached new data with key:', cacheKey);
        }
        catch (error) {
            console.error('Error caching new data:', error);
        }
        return result.data;
    }
    async getAllTasks() {
        const cacheKey = 'tasks:all';
        console.log(`Fetching all tasks`);
        console.log(`Cache key: ${cacheKey}`);
        // Attempt to retrieve cached data
        let cachedData;
        try {
            cachedData = await (0, redis_client_1.getCachedData)(cacheKey);
            console.log(`Retrieved cache data: ${cachedData}`);
        }
        catch (error) {
            console.error('Error retrieving cached data:', error);
            cachedData = null;
        }
        if (cachedData) {
            console.log('Cache hit: Returning cached data');
            return JSON.parse(cachedData);
        }
        console.log('Cache miss: Fetching data from repository');
        // Fetch data from repository
        let tasks;
        try {
            tasks = await this.taskRepo.getAllTasks();
            console.log('Fetched data from repository:', tasks);
        }
        catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch tasks from repository');
        }
        // Cache the newly fetched data
        try {
            await (0, redis_client_1.cacheData)(cacheKey, JSON.stringify(tasks));
            console.log('Cached new data with key:', cacheKey);
        }
        catch (error) {
            console.error('Error caching new data:', error);
        }
        return tasks;
    }
    async deleteTaskById(taskId) {
        const cacheKey = `task:${taskId}`;
        console.log(`Deleting task by id: ${taskId}`);
        try {
            // Attempt to retrieve cached data
            const cachedData = await (0, redis_client_1.getCachedData)(cacheKey);
            if (cachedData) {
                console.log('Cache hit: Returning cached data');
                return JSON.parse(cachedData);
            }
            console.log('Cache miss: Fetching data from repository');
        }
        catch (error) {
            console.error('Error retrieving cached data:', error);
        }
        // Fetch task from repository
        let task;
        try {
            task = await this.taskRepo.findById(taskId);
            if (!task) {
                console.log('Task not found in repository');
                return false;
            }
            console.log('Fetched data from repository:', task);
        }
        catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch task from repository');
        }
        // Delete the task
        try {
            const result = await this.taskRepo.deleteTaskById(taskId);
            if (result) {
                console.log(`Task deleted: ${taskId}`);
                await (0, redis_client_1.cacheData)(cacheKey, JSON.stringify(task));
                console.log(`Deleted task cache with key: ${cacheKey}`);
            }
            return result;
        }
        catch (error) {
            console.error('Error deleting task:', error);
            throw new Error('Failed to delete task');
        }
    }
    async getTaskById(taskId) {
        const cacheKey = `task:${taskId}`;
        console.log(`Fetching task by id: ${taskId}`);
        try {
            const cachedData = await (0, redis_client_1.getCachedData)(cacheKey);
            if (cachedData) {
                console.log('Cache hit: Returning cached data');
                return JSON.parse(cachedData);
            }
            console.log('Cache miss: Fetching data from repository');
        }
        catch (error) {
            console.error('Error retrieving cached data:', error);
        }
        // Fetch task from repository
        let task;
        try {
            task = await this.taskRepo.findById(taskId);
            if (!task) {
                console.log('Task not found in repository');
                return null;
            }
            console.log('Fetched data from repository:', task);
        }
        catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch task from repository');
        }
        // Cache the fetched data
        try {
            await (0, redis_client_1.cacheData)(cacheKey, JSON.stringify(task));
            console.log('Cached new data with key:', cacheKey);
        }
        catch (error) {
            console.error('Error caching new data:', error);
        }
        return task;
    }
}
exports.TaskService = TaskService;
