"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const tagmodel_1 = __importDefault(require("../db/models/tagmodel"));
const taskmodel_1 = __importDefault(require("../db/models/taskmodel"));
const usermodel_1 = __importDefault(require("../db/models/usermodel"));
class TaskRepository {
    async createTask(taskData) {
        return await taskmodel_1.default.create(taskData);
    }
    async findById(taskId) {
        return await taskmodel_1.default.findByPk(taskId);
    }
    // Reads the row with a FOR UPDATE lock inside the given transaction, so
    // concurrent assign/status-update requests for the same task serialize
    // instead of racing on a read-modify-write cycle (lost-update prevention).
    async findByIdForUpdate(taskId, transaction) {
        return await taskmodel_1.default.findByPk(taskId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
    }
    async addTagsToTask(task, tags, transaction) {
        for (const tag of tags) {
            await task.addTags(tag, transaction ? { transaction } : undefined);
        }
    }
    async getAllTasks() {
        return await taskmodel_1.default.findAll();
    }
    async getAllTasksWithFilters(filters) {
        const { page = 1, limit = 10, sortBy = 'dueDate', sortOrder = 'ASC', status, dueDate, tagId, } = filters;
        const offset = (page - 1) * limit;
        // Build the where options based on the provided filters
        const whereOptions = {};
        if (status) {
            whereOptions.status = status;
        }
        if (dueDate) {
            whereOptions.dueDate = dueDate;
        }
        // tagId is no longer a column on tasksTable (tags are many-to-many via
        // TaskTags), so filtering by tag is expressed as a join condition.
        const tagsInclude = tagId
            ? { model: tagmodel_1.default, as: 'tags', where: { id: tagId }, required: true }
            : { model: tagmodel_1.default, as: 'tags' };
        const options = {
            where: whereOptions,
            limit,
            offset,
            order: [[String(sortBy), String(sortOrder)]],
            include: [
                tagsInclude,
                { model: usermodel_1.default, as: 'creator' },
                { model: usermodel_1.default, as: 'assignee' },
            ],
        };
        const tasks = await taskmodel_1.default.findAll(options);
        const total = await taskmodel_1.default.count({ where: whereOptions, include: tagId ? [tagsInclude] : [] });
        return {
            total,
            page,
            limit,
            data: tasks,
        };
    }
    async deleteTaskById(taskId) {
        return await taskmodel_1.default.destroy({ where: { id: taskId } });
    }
}
exports.TaskRepository = TaskRepository;
