// src/service/task.service.ts

import { TaskRepository } from '../repository/task.repository';
import { TaskAttributes, CreateTaskInput, TaskStatus, GetTaskFilter } from '../interfaces/task.interface';
import { v4 as uuidv4 } from 'uuid';
import TaskModel from '../db/models/taskmodel';
import UserModel from '../db/models/usermodel';
import { TagRepository } from '../repository/tag.repository';
import TagModel from '../db/models/tagmodel';
import { NotificationService } from './notification.service';
import { client } from '../db/redis.client'; 
import { cacheData, getCachedData } from '../utils/helper';

export class TaskService {
    private taskRepo: TaskRepository;
    private tagRepo: TagRepository;

    constructor() {
        this.taskRepo = new TaskRepository();
        this.tagRepo = new TagRepository();
    }

    public async createTask(taskData: CreateTaskInput, userId: string): Promise<TaskModel> {

        const taskToCreate: TaskAttributes = {
            ...taskData,
            createdById: userId, // Add the createdById from the user context
            id: uuidv4(), // Generate a new UUID for the task
            status: taskData.status || 'Pending'
        };
        
        
        const task = await this.taskRepo.createTask(taskToCreate);
        await cacheData(`task:${task.id}`, JSON.stringify(task));
        return task;
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

        const message = `You have been assigned a new task: ${task.title}`;
        await NotificationService.createNotification(assignedUser.id, taskId, 'task_assigned', message);

        await client.publish('task_notifications', JSON.stringify({ userId: assignedUser.id, taskId, type: 'task_assigned', message }));
        
        await task.save();
        await cacheData(`task:${task.id}`, JSON.stringify(task));
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

        const message = `The status of task "${task.title}" has been updated to ${status}`;
        await NotificationService.createNotification(task.assignedToId, taskId, 'task_status_updated', message);
        
        await cacheData(`task:${task.id}`, JSON.stringify(task));
        return task;
    }

    async addTagsToTask(taskId: string, tagIds: string[]) {
        // Fetch the task to ensure it exists
        const task = await TaskModel.findOne({
            where: { id: taskId },
        });
    
        if (!task) {
            return {
                message: "Failed to add tags to task",
                error: "Task not found",
            };
        }
    
        // Fetch the tags to ensure they exist
        const tags = await Promise.all(tagIds.map(id => this.tagRepo.getTagById(id)));
    
        // Filter out null values (i.e., non-existent tags)
        const validTags = tags.filter((tag): tag is TagModel => tag !== null);
    
        if (validTags.length === 0) {
            return {
                message: "Failed to add tags to task",
                error: "No valid tags found",
            };
        }
    
        // Since `tagId` is not designed to hold multiple tags, we'll iterate over `validTags`
        // and update the task's `tagId` for each valid tag
        for (const tag of validTags) {
            await task.update({ tagId: tag.id });
        }
    
        await cacheData(`task:${task.id}`, JSON.stringify(task));
        return {
            message: "Tags successfully associated with task",
            task: task,
        };
    }
    

    public async getAllTasksWithFilters(filters: GetTaskFilter): Promise<TaskModel[]> {
        const cacheKey = `tasks:filters:${JSON.stringify(filters)}`;
        const cachedData = await getCachedData(cacheKey);
        console.log({ cacheData: cachedData });

        if (cachedData) {
            console.log('Cache hit');
            return JSON.parse(cachedData) as TaskModel[];
        }


        const result = await this.taskRepo.getAllTasksWithFilters(filters);
        await cacheData(cacheKey, JSON.stringify(result.data));
        return result.data;
    }

    async getAllTasks(): Promise<TaskModel[]> {
        const cacheKey = 'tasks:all';
        const cachedData = await getCachedData(cacheKey);
        console.log({ cachedData });

        if (cachedData) {
            console.log('Cache hit');
            return JSON.parse(cachedData) as TaskModel[];
        }

        console.log('Cache miss');
        const tasks = await this.taskRepo.getAllTasks();
        await cacheData(cacheKey, JSON.stringify(tasks));
        return tasks;
    }
}
