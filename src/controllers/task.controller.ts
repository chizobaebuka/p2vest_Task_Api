import { Response } from 'express';
import { GetTaskFilter, TaskStatus } from '../interfaces/task.interface';
import { TaskService } from '../service/task.service';
import { RequestExt } from '../middleware/auth.middleware';
import { addTagsToTaskSchema, assignTaskSchema, createTaskSchema, GetTaskFilterSchema, taskIdParamSchema, updateTaskStatusSchema } from '../utils/validation';
import { z } from 'zod';
import { FindOptions, WhereOptions } from 'sequelize';
import TaskModel from '../db/models/taskmodel';

export class TaskController {
    private taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }

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
                status: req.body.status as TaskStatus 
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
            const { tagIds } = addTagsToTaskSchema.parse(req.body);
            const { taskId } = taskIdParamSchema.parse(req.params);

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
    
    public async getAllTasks(req: RequestExt, res: Response): Promise<Response> {
        try {
            const tasks = await this.taskService.getAllTasks();
            return res.status(200).json({ tasks });
        } catch (error: any) {
            return res.status(500).json({ error: 'Error fetching tasks' });
        }
    }

    async getAllTasksWithFilters(req: RequestExt, res: Response) {
        try {
            const { page, limit, sortBy, sortOrder, status, dueDate, tagId } = req.query;

            const filters: GetTaskFilter = {
                page: page ? parseInt(page as string, 10) : 1,
                limit: limit ? parseInt(limit as string, 10) : 10,
                sortBy: sortBy as string || 'dueDate',
                sortOrder: sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder as 'ASC' | 'DESC' : undefined,
                status: status as 'Pending' | 'In Progress' | 'Completed' | undefined,
                dueDate: dueDate ? new Date(dueDate as string) : undefined,
                tagId: tagId as string,
            };
            const tasks = await this.taskService.getAllTasksWithFilters(filters);
            return res.status(200).json({ tasks });
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching tasks' });
        }
    }

    async deleteTask(req: RequestExt, res: Response) {
        try {
            const { taskId } = taskIdParamSchema.parse(req.params);
            
            const result = await this.taskService.deleteTaskById(taskId);
            if (result) {
                return res.status(204).json({ message: 'Task deleted successfully' });
            } else {
                return res.status(404).json({ error: 'Task not found' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error deleting task' });
        }
    }
    

    async getTaskById(req: RequestExt, res: Response) {
        try {
            const { taskId } = taskIdParamSchema.parse(req.params);
            const task = await this.taskService.getTaskById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.status(200).json({ task });
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching task' });
        }
    }
}
