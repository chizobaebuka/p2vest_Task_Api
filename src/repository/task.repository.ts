// src/repository/task.repository.ts
import { FindOptions, WhereOptions } from 'sequelize';
import TagModel from '../db/models/tagmodel';
import TaskModel from '../db/models/taskmodel';
import { GetTaskFilter, TaskAttributes } from '../interfaces/task.interface';

export class TaskRepository {
    public async createTask(taskData: TaskAttributes): Promise<TaskModel> {
        return await TaskModel.create(taskData);
    }

    public async findById(taskId: string): Promise<TaskModel | null> {
        return await TaskModel.findByPk(taskId);
    }

    public async addTagsToTask(task: TaskModel, tags: TagModel[]): Promise<void> {
        for (const tag of tags) {
            await task.addTags(tag);
        }
    }

    public async getAllTasks(): Promise<TaskModel[]> {
        return await TaskModel.findAll();
    }

    async getAllTasksWithFilters(filters: GetTaskFilter) {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'dueDate', 
            sortOrder = 'ASC', 
            status, 
            dueDate,
            tagId 
        } = filters;
    
        const offset = (page - 1) * limit;
    
        // Build the where options based on the provided filters
        const whereOptions: WhereOptions = {};
    
        if (status) {
            whereOptions.status = status;
        }
    
        if (dueDate) {
            whereOptions.dueDate = dueDate;
        }
    
        if (tagId) {
            whereOptions.tagId = tagId; 
        }
    
        const options: FindOptions = {
            where: whereOptions,
            limit,
            offset,
            order: [[String(sortBy), String(sortOrder)]],
        };
    
        const tasks = await TaskModel.findAll(options);
        const total = await TaskModel.count({ where: whereOptions });
    
        return {
            total,
            page,
            limit,
            data: tasks,
        };
    }
    
}
