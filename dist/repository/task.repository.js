"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const taskmodel_1 = __importDefault(require("../db/models/taskmodel"));
class TaskRepository {
    async createTask(taskData) {
        return await taskmodel_1.default.create(taskData);
    }
    async findById(taskId) {
        return await taskmodel_1.default.findByPk(taskId);
    }
    async addTagsToTask(task, tags) {
        for (const tag of tags) {
            await task.addTags(tag);
        }
    }
    async getAllTasks() {
        return await taskmodel_1.default.findAll();
    }
    async getAllTasksWithFilters(filters) {
        const { page = 1, limit = 10, sortBy = 'dueDate', sortOrder = 'ASC', status, dueDate, tagId // Include tagId in filters
         } = filters;
        const offset = (page - 1) * limit;
        // Build the where options based on the provided filters
        const whereOptions = {};
        if (status) {
            whereOptions.status = status;
        }
        if (dueDate) {
            whereOptions.dueDate = dueDate;
        }
        if (tagId) {
            whereOptions.tagId = tagId; // Filter by tagId if provided
        }
        // Define the find options, including pagination and sorting
        const options = {
            where: whereOptions,
            limit,
            offset,
            order: [[String(sortBy), String(sortOrder)]],
        };
        // Fetch tasks that match the filter criteria
        const tasks = await taskmodel_1.default.findAll(options);
        // Get the total count of tasks that match the filter criteria
        const total = await taskmodel_1.default.count({ where: whereOptions });
        return {
            total,
            page,
            limit,
            data: tasks,
        };
    }
}
exports.TaskRepository = TaskRepository;
