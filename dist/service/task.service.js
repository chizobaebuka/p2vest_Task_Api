"use strict";
// src/service/task.service.ts
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
exports.TaskService = void 0;
const uuid_1 = require("uuid");
const usermodel_1 = __importDefault(require("../db/models/usermodel"));
class TaskService {
    constructor(taskRepo) {
        this.taskRepo = taskRepo;
    }
    createTask(taskData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskToCreate = Object.assign(Object.assign({}, taskData), { createdById: userId, id: (0, uuid_1.v4)(), status: taskData.status || 'Pending' });
            return yield this.taskRepo.createTask(taskToCreate);
        });
    }
    assignTask(taskId, assignedToId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepo.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            // Validate the assigned user exists
            const assignedUser = yield usermodel_1.default.findByPk(assignedToId);
            if (!assignedUser) {
                throw new Error('Assigned user does not exist');
            }
            task.assignedToId = assignedToId;
            task.status = 'In Progress'; // Change status to In Progress once assigned
            yield task.save();
            return task;
        });
    }
    updateTaskStatus(taskId, status, userId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepo.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            // Check if the user is allowed to update the task status
            if (userRole !== 'Admin' && task.createdById !== userId) {
                throw new Error('Forbidden: Not authorized to update this task');
            }
            // Update the task status
            task.status = status;
            yield task.save();
            return task;
        });
    }
}
exports.TaskService = TaskService;
