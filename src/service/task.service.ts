import { TaskRepository } from '../repository/task.repository';
import { TaskAttributes, CreateTaskInput, TaskStatus, GetTaskFilter } from '../interfaces/task.interface';
import { v4 as uuidv4 } from 'uuid';
import TaskModel from '../db/models/taskmodel';
import UserModel from '../db/models/usermodel';
import { TagRepository } from '../repository/tag.repository';
import TagModel from '../db/models/tagmodel';
import { NotificationService } from './notification.service';
import { cacheData, getCachedData } from '../db/redis.client';
import { io } from '../server';
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
            createdById: userId,
            id: uuidv4(),
            status: taskData.status || 'Pending'
        };

        let task: TaskModel;
        try {
            task = await this.taskRepo.createTask(taskToCreate);
            console.log(`Task created with ID: ${task.id}`);
        } catch (error) {
            console.error('Error creating task:', error);
            throw new Error('Error creating task');
        }

        // Cache the created task
        try {
            await cacheData(`task:${task.id}`, JSON.stringify(task));
            console.log(`Cached task with key: task:${task.id}`);
        } catch (error) {
            console.error('Error caching task data:', error);
        }

        return task;
    }

    public async assignTask(taskId: string, assignedToId: string): Promise<TaskModel | null> {
        const task = await this.taskRepo.findById(taskId);
        if (!task) {
            console.error(`Task with ID ${taskId} not found.`);
            throw new Error('Task not found');
        }

        // Validate the assigned user exists
        const assignedUser = await UserModel.findByPk(assignedToId);
        if (!assignedUser) {
            console.error(`Assigned user with ID ${assignedToId} does not exist.`);
            throw new Error('Assigned user does not exist');
        }

        // Update task details
        task.assignedToId = assignedToId;
        task.status = 'In Progress';

        // Create a notification
        const message = `You have been assigned a new task: ${task.title}`;
        await NotificationService.createNotification(assignedUser.id, taskId, 'task_assigned', message);

        io.emit('task_assigned', task.title, task.assignedToId)

        // Save the task
        try {
            await task.save();
        } catch (error) {
            console.error('Error saving task:', error);
        }

        // Cache the updated task
        try {
            await cacheData(`task:${task.id}`, JSON.stringify(task));
            console.log(`Cached task with key: task:${task.id}`);
        } catch (error) {
            console.error('Error caching task data:', error);
        }

        return task;
    }

    public async updateTaskStatus(taskId: string, status: TaskStatus, userId: string, userRole: string): Promise<TaskModel | null> {
        const cacheKey = `task_status:${taskId}`;
        console.log(`Retrieving cache for key: ${cacheKey}`);
        const cachedStatus = await getCachedData(cacheKey);
        console.log(`Cached status: ${cachedStatus}`);

        if (!cachedStatus) {
            console.log('Cache miss. Updating status and caching the new value.');
            const task = await this.taskRepo.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }

            if (userRole !== 'Admin' && task.createdById !== userId) {
                throw new Error('Forbidden: Not authorized to update this task');
            }

            task.status = status;
            await task.save();

            const message = `The status of task "${task.title}" has been updated to ${status}`;
            await NotificationService.createNotification(task.assignedToId, taskId, 'task_status_updated', message);

            io.emit('task_updated', task.title, userId)

            await cacheData(cacheKey, JSON.stringify(task)); 
            return task;
        }

        return JSON.parse(cachedStatus) as TaskModel; 
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

        try {
            await cacheData(`task:${task.id}`, JSON.stringify(task));
            console.log(`Cached updated task with key: task:${task.id}`);
        } catch (error) {
            console.error('Error caching updated task data:', error);
        }

        return {
            message: "Tags successfully associated with task",
            task: task,
        };
    }


    public async getAllTasksWithFilters(filters: GetTaskFilter): Promise<TaskModel[]> {
        const cacheKey = `tasks:filters:${JSON.stringify(filters)}`;
        console.log(`Cache key: ${cacheKey}`);

        // Attempt to retrieve cached data
        let cachedData: string | null;
        try {
            cachedData = await getCachedData(cacheKey);
            console.log(`Retrieved cache data: ${cachedData}`);
        } catch (error) {
            console.error('Error retrieving cached data:', error);
            cachedData = null;
        }

        if (cachedData) {
            console.log('Cache hit: Returning cached data');
            return JSON.parse(cachedData) as TaskModel[];
        }

        console.log('Cache miss: Fetching data from repository');

        // Fetch data from repository
        let result: { data: TaskModel[] };
        try {
            result = await this.taskRepo.getAllTasksWithFilters(filters);
        } catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch tasks from repository');
        }

        // Cache the newly fetched data
        try {
            await cacheData(cacheKey, JSON.stringify(result.data));
            console.log('Cached new data with key:', cacheKey);
        } catch (error) {
            console.error('Error caching new data:', error);
        }

        return result.data;
    }


    async getAllTasks(): Promise<TaskModel[]> {
        const cacheKey = 'tasks:all';
        console.log(`Fetching all tasks`);
        console.log(`Cache key: ${cacheKey}`);

        // Attempt to retrieve cached data
        let cachedData: string | null;
        try {
            cachedData = await getCachedData(cacheKey);
            console.log(`Retrieved cache data: ${cachedData}`);
        } catch (error) {
            console.error('Error retrieving cached data:', error);
            cachedData = null;
        }

        if (cachedData) {
            console.log('Cache hit: Returning cached data');
            return JSON.parse(cachedData) as TaskModel[];
        }

        console.log('Cache miss: Fetching data from repository');

        // Fetch data from repository
        let tasks: TaskModel[];
        try {
            tasks = await this.taskRepo.getAllTasks();
            console.log('Fetched data from repository:', tasks);
        } catch (error) {
            console.error('Error fetching data from repository:', error);
            throw new Error('Failed to fetch tasks from repository');
        }

        // Cache the newly fetched data
        try {
            await cacheData(cacheKey, JSON.stringify(tasks));
            console.log('Cached new data with key:', cacheKey);
        } catch (error) {
            console.error('Error caching new data:', error);
        }

        return tasks;
    }

}
