import { z } from 'zod';
import { TaskStatus } from '../interfaces/task.interface';

export const registrationSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['Admin', 'Regular']).optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    status: z.enum(['Pending', 'In Progress', 'Completed']).default('Pending'),
    dueDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    assignedToId: z.string().uuid().optional(), // Optional, must be a valid UUID if provided
    // createdById: z.string().uuid(), // Added required field for createdById
});

export const updateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
});


export const updateTaskStatusSchema = z.object({
    taskId: z.string().uuid('Invalid task ID'),
    status: z.nativeEnum(TaskStatus), // Use nativeEnum for TaskStatus
});

export const assignTaskSchema = z.object({
    taskId: z.string().uuid('Invalid task ID'),
    assignedToId: z.string().uuid('Invalid assigned user ID'),
});

export const createTagSchema = z.object({
    name: z.string().min(1, 'Tag name is required'),
})

export const addTagsToTaskSchema = z.object({
    taskId: z.string().uuid('Invalid task ID'),
    tagIds: z.array(z.string().uuid('Invalid tag ID')).min(1, 'At least one tag ID is required'),
})