import { TaskRepository } from '../repository/task.repository';
import { TaskAttributes, CreateTaskInput, TaskStatus, GetTaskFilter } from '../interfaces/task.interface';
import { v4 as uuidv4 } from 'uuid';
import TaskModel from '../db/models/taskmodel';
import UserModel from '../db/models/usermodel';
import { TagRepository } from '../repository/tag.repository';
import TagModel from '../db/models/tagmodel';
import { NotificationService } from './notification.service';
import { cacheData, deleteCachedData, getCachedData } from '../db/redis.client';
import { io } from '../server';
import connection from '../db/sequelize';

export class TaskService {
    private taskRepo: TaskRepository;
    private tagRepo: TagRepository;

    constructor() {
        this.taskRepo = new TaskRepository();
        this.tagRepo = new TagRepository();
    }

    // Cache is a write-through, best-effort accelerator for reads. It must
    // never be consulted to decide whether a write happens, and every
    // mutation must invalidate it so reads can't observe stale data forever.
    private async invalidateTaskCaches(taskId: string): Promise<void> {
        await Promise.all([
            deleteCachedData(`task:${taskId}`),
            deleteCachedData(`task_status:${taskId}`),
            deleteCachedData('tasks:all'),
        ]);
    }

    public async createTask(taskData: CreateTaskInput, userId: string): Promise<TaskModel> {
        const taskToCreate: TaskAttributes = {
            ...taskData,
            createdById: userId,
            id: uuidv4(),
            status: taskData.status || 'Pending'
        };

        const task = await this.taskRepo.createTask(taskToCreate);
        console.log(`Task created with ID: ${task.id}`);

        await this.invalidateTaskCaches(task.id);
        try {
            await cacheData(`task:${task.id}`, JSON.stringify(task));
        } catch (error) {
            console.error('Error caching task data:', error);
        }

        return task;
    }

    public async assignTask(taskId: string, assignedToId: string, userId: string, userRole: string): Promise<TaskModel> {
        const assignedUser = await UserModel.findByPk(assignedToId);
        if (!assignedUser) {
            throw new Error('Assigned user does not exist');
        }

        const task = await connection.transaction(async (t) => {
            const task = await this.taskRepo.findByIdForUpdate(taskId, t);
            if (!task) {
                throw new Error('Task not found');
            }

            if (userRole !== 'Admin' && task.createdById !== userId) {
                throw new Error('Forbidden: Not authorized to assign this task');
            }

            task.assignedToId = assignedUser.id;
            task.status = 'In Progress';
            await task.save({ transaction: t });

            const message = `You have been assigned a new task: ${task.title}`;
            await NotificationService.createNotification(assignedUser.id, taskId, 'task_assigned', message, t);

            return task;
        });

        io.emit('task_assigned', task.title, task.assignedToId);

        await this.invalidateTaskCaches(task.id);
        try {
            await cacheData(`task:${task.id}`, JSON.stringify(task));
        } catch (error) {
            console.error('Error caching task data:', error);
        }

        return task;
    }

    public async updateTaskStatus(taskId: string, status: TaskStatus, userId: string, userRole: string): Promise<TaskModel> {
        const task = await connection.transaction(async (t) => {
            const task = await this.taskRepo.findByIdForUpdate(taskId, t);
            if (!task) {
                throw new Error('Task not found');
            }

            if (userRole !== 'Admin' && task.createdById !== userId) {
                throw new Error('Forbidden: Not authorized to update this task');
            }

            task.status = status;
            await task.save({ transaction: t });

            // A task may not have an assignee yet (e.g. its creator changes
            // its status before assigning it) - only notify if there's
            // someone to notify.
            if (task.assignedToId) {
                const message = `The status of task "${task.title}" has been updated to ${status}`;
                await NotificationService.createNotification(task.assignedToId, taskId, 'task_status_updated', message, t);
            }

            return task;
        });

        io.emit('task_updated', task.title, userId);

        await this.invalidateTaskCaches(task.id);
        try {
            await cacheData(`task:${task.id}`, JSON.stringify(task));
        } catch (error) {
            console.error('Error caching task data:', error);
        }

        return task;
    }

    async addTagsToTask(taskId: string, tagIds: string[]): Promise<TaskModel> {
        const task = await connection.transaction(async (t) => {
            const task = await this.taskRepo.findByIdForUpdate(taskId, t);
            if (!task) {
                throw new Error('Task not found');
            }

            const tags = await Promise.all(tagIds.map(id => this.tagRepo.getTagById(id)));
            const validTags = tags.filter((tag): tag is TagModel => tag !== null);

            if (validTags.length === 0) {
                throw new Error('No valid tags found');
            }

            // Only attach tags not already associated, so retrying this call
            // is idempotent instead of relying on catching unique-constraint errors.
            const existingTags = await task.getTags({ transaction: t });
            const existingTagIds = new Set(existingTags.map(tag => tag.id));
            const newTags = validTags.filter(tag => !existingTagIds.has(tag.id));

            if (newTags.length > 0) {
                await this.taskRepo.addTagsToTask(task, newTags, t);
            }

            return task;
        });

        await this.invalidateTaskCaches(task.id);
        try {
            await cacheData(`task:${task.id}`, JSON.stringify(task));
        } catch (error) {
            console.error('Error caching updated task data:', error);
        }

        return task;
    }


    public async getAllTasksWithFilters(filters: GetTaskFilter): Promise<TaskModel[]> {
        const cacheKey = `tasks:filters:${JSON.stringify(filters)}`;

        let cachedData: string | null;
        try {
            cachedData = await getCachedData(cacheKey);
        } catch (error) {
            console.error('Error retrieving cached data:', error);
            cachedData = null;
        }

        if (cachedData) {
            return JSON.parse(cachedData) as TaskModel[];
        }

        let result: { data: TaskModel[] };
        try {
            result = await this.taskRepo.getAllTasksWithFilters(filters);
        } catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch tasks from repository');
        }

        // This cache key is one of many possible filter permutations; it is
        // deliberately left to expire via TTL rather than actively
        // invalidated on every task mutation (see invalidateTaskCaches).
        try {
            await cacheData(cacheKey, JSON.stringify(result.data));
        } catch (error) {
            console.error('Error caching new data:', error);
        }

        return result.data;
    }

    async getAllTasks(): Promise<TaskModel[]> {
        const cacheKey = 'tasks:all';

        let cachedData: string | null;
        try {
            cachedData = await getCachedData(cacheKey);
        } catch (error) {
            console.error('Error retrieving cached data:', error);
            cachedData = null;
        }

        if (cachedData) {
            return JSON.parse(cachedData) as TaskModel[];
        }

        let tasks: TaskModel[];
        try {
            tasks = await this.taskRepo.getAllTasks();
        } catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch tasks from repository');
        }

        try {
            await cacheData(cacheKey, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error caching new data:', error);
        }

        return tasks;
    }

    async deleteTaskById(taskId: string): Promise<boolean> {
        const task = await this.taskRepo.findById(taskId);
        if (!task) {
            return false;
        }

        const result = await this.taskRepo.deleteTaskById(taskId);
        if (result === 0) {
            return false;
        }

        await this.invalidateTaskCaches(taskId);
        return true;
    }

    async getTaskById(taskId: string) {
        const cacheKey = `task:${taskId}`;

        try {
            const cachedData = await getCachedData(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData) as TaskModel;
            }
        } catch (error) {
            console.error('Error retrieving cached data:', error);
        }

        let task: TaskModel | null;
        try {
            task = await this.taskRepo.findById(taskId);
            if (!task) {
                return null;
            }
        } catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch task from repository');
        }

        try {
            await cacheData(cacheKey, JSON.stringify(task));
        } catch (error) {
            console.error('Error caching new data:', error);
        }

        return task;
    }
}
