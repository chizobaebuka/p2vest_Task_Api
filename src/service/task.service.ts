// src/service/task.service.ts

import { TaskRepository } from '../repository/task.repository';
import { TaskAttributes, CreateTaskInput, TaskStatus } from '../interfaces/task.interface';
import { v4 as uuidv4 } from 'uuid';
import TaskModel from '../db/models/taskmodel';
import UserModel from '../db/models/usermodel';

export class TaskService {
    private taskRepo: TaskRepository;

    constructor(taskRepo: TaskRepository) {
        this.taskRepo = taskRepo;
    }

    public async createTask(taskData: CreateTaskInput, userId: string): Promise<TaskModel> {

        const taskToCreate: TaskAttributes = {
            ...taskData,
            createdById: userId, // Add the createdById from the user context
            id: uuidv4(), // Generate a new UUID for the task
            status: taskData.status || 'Pending'
        };

        return await this.taskRepo.createTask(taskToCreate);
    }

    public async assignTask(taskId: string, assignedToId: string): Promise<TaskModel | null> {
        const task = await this.taskRepo.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        // Validate the assigned user exists
        const assignedUser = await UserModel.findByPk(assignedToId);
        if (!assignedUser) {
            throw new Error('Assigned user does not exist');
        }

        task.assignedToId = assignedToId;
        task.status = 'In Progress'; // Change status to In Progress once assigned
        await task.save();

        return task;
    }

    public async updateTaskStatus(taskId: string, status: TaskStatus, userId: string, userRole: string): Promise<TaskModel | null> {
        const task = await this.taskRepo.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        // Check if the user is allowed to update the task status
        if (userRole !== 'Admin' && task.createdById !== userId) {
            throw new Error('Forbidden: Not authorized to update this task');
        }

        // Update the task status
        task.status = status;
        await task.save();

        return task;
    }
}
