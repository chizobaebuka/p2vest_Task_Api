import { NextFunction, Response } from 'express';
import { CreateTaskInput, TaskStatus } from '../interfaces/task.interface';
import { TaskService } from '../service/task.service';
import { RequestExt } from '../middleware/auth.middleware';
import { addTagsToTaskSchema, assignTaskSchema, createTaskSchema, updateTaskStatusSchema } from '../utils/validation';
import { z } from 'zod';

export class TaskController {
    private taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }

    // Create a new task
    public async createTask(req: RequestExt, res: Response): Promise<Response> {
        try {
            const taskData = createTaskSchema.parse(req.body);
            const userId = req.user?.id as string;

            if (!userId) {
                return res.status(400).json({ error: 'User not authenticated' });
            }

            const newTask = await this.taskService.createTask(taskData, userId);
            return res.status(201).json({ message: 'Task created successfully', task: newTask });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: 'Validation error', details: error.errors });
            }
            return res.status(400).json({ error: 'Error creating task: ' + error.message });
        }
    }

    // Assign a task to a user
    public async assignTask(req: RequestExt, res: Response): Promise<Response> {
        try {
            // Validate request parameters
            const { taskId, assignedToId } = assignTaskSchema.parse({
                taskId: req.params.taskId,
                assignedToId: req.params.assignedToId,
            });

            // Ensure the assignedToId is valid and associated with a user
            if (!assignedToId) {
                return res.status(400).json({ error: 'Assigned user ID is required' });
            }

            // Call service method to assign task
            const updatedTask = await this.taskService.assignTask(taskId, assignedToId);
            return res.status(200).json({ message: 'Task assigned successfully', task: updatedTask });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: 'Validation error', details: error.errors });
            }
            return res.status(400).json({ error: 'Error assigning task: ' + error.message });
        }
    }

    public async updateTaskStatus(req: RequestExt, res: Response): Promise<Response> {
        try {
            const { taskId, status } = updateTaskStatusSchema.parse({
                taskId: req.params.taskId,
                status: req.body.status as TaskStatus // Ensure status is treated as TaskStatus
            });

            const userId = req.user?.id as string;
            const userRole = req.user?.role as string;

            const updatedTask = await this.taskService.updateTaskStatus(taskId, status, userId, userRole);
            return res.status(200).json({ message: 'Task status updated successfully', task: updatedTask });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: 'Validation error', details: error.errors });
            }
            return res.status(400).json({ error: 'Error updating task status: ' + error.message });
        }
    }

    public async addTagsToTask(req: RequestExt, res: Response): Promise<Response> {
        try {
            // Validate the request body using Zod schema
            const { taskId, tagIds } = addTagsToTaskSchema.parse(req.body);

            const task = await this.taskService.addTagsToTask(taskId, tagIds);
            if (!task) {
                return res.status(404).json({ message: 'Task or Tags not found' });
            }

            return res.status(200).json({ message: 'Tags added to task successfully', task });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: 'Validation error', details: error.errors });
            }
            return res.status(500).json({ message: 'Failed to add tags to task', error: error.message });
        }
    }
    
}
