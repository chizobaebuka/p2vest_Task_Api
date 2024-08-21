"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTaskSchema = exports.updateTaskStatusSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.loginSchema = exports.registrationSchema = void 0;
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
