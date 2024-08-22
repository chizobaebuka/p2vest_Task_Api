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
}
exports.TaskRepository = TaskRepository;
