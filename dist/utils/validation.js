"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTaskFilterSchema = exports.addTagSchema = exports.taskIdParamSchema = exports.addCommentSchema = exports.addTagsToTaskSchema = exports.createTagSchema = exports.assignTaskSchema = exports.updateTaskStatusSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.loginSchema = exports.registrationSchema = void 0;
const zod_1 = require("zod");
const task_interface_1 = require("../interfaces/task.interface");
exports.registrationSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['Admin', 'Regular']).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    status: zod_1.z.enum(['Pending', 'In Progress', 'Completed']).default('Pending'),
    dueDate: zod_1.z.string().optional().transform((val) => val ? new Date(val) : undefined),
    assignedToId: zod_1.z.string().uuid().optional(), // Optional, must be a valid UUID if provided
    // createdById: z.string().uuid(), // Added required field for createdById
});
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['Pending', 'In Progress', 'Completed']).optional(),
});
exports.updateTaskStatusSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid('Invalid task ID'),
    status: zod_1.z.nativeEnum(task_interface_1.TaskStatus), // Use nativeEnum for TaskStatus
});
exports.assignTaskSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid('Invalid task ID'),
    assignedToId: zod_1.z.string().uuid('Invalid assigned user ID'),
});
exports.createTagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Tag name is required'),
});
exports.addTagsToTaskSchema = zod_1.z.object({
    tagIds: zod_1.z.array(zod_1.z.string().uuid('Invalid tag ID')).min(1, 'At least one tag ID is required'),
});
exports.addCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, 'Content is required'), // Validate that content is a non-empty string
});
exports.taskIdParamSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid('Invalid task ID'),
});
exports.addTagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Tag name is required'),
});
exports.GetTaskFilterSchema = zod_1.z.object({
    page: zod_1.z.number().min(1).optional(),
    limit: zod_1.z.number().min(1).max(100).optional(),
    sortBy: zod_1.z.enum(['dueDate']).optional(), // Sorting only by dueDate for simplicity
    sortOrder: zod_1.z.enum(['ASC', 'DESC']).optional(),
    status: zod_1.z.enum(['Pending', 'In Progress', 'Completed']).optional(),
    tagId: zod_1.z.string().uuid().optional(),
    dueDate: zod_1.z.string().transform((str) => new Date(str)).optional(), // Assuming dueDate is passed as a string
});
