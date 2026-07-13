// src/repository/task.repository.ts
import { FindOptions, Transaction, WhereOptions } from 'sequelize';
import TagModel from '../db/models/tagmodel';
import TaskModel from '../db/models/taskmodel';
import { GetTaskFilter, TaskAttributes } from '../interfaces/task.interface';
import UserModel from '../db/models/usermodel';

export class TaskRepository {
    public async createTask(taskData: TaskAttributes): Promise<TaskModel> {
        return await TaskModel.create(taskData);
    }

    public async findById(taskId: string): Promise<TaskModel | null> {
        return await TaskModel.findByPk(taskId);
    }

    // Reads the row with a FOR UPDATE lock inside the given transaction, so
    // concurrent assign/status-update requests for the same task serialize
    // instead of racing on a read-modify-write cycle (lost-update prevention).
    public async findByIdForUpdate(taskId: string, transaction: Transaction): Promise<TaskModel | null> {
        return await TaskModel.findByPk(taskId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
    }

    public async addTagsToTask(task: TaskModel, tags: TagModel[], transaction?: Transaction): Promise<void> {
        for (const tag of tags) {
            await task.addTags(tag, transaction ? { transaction } : undefined);
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
            tagId,
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

        // tagId is no longer a column on tasksTable (tags are many-to-many via
        // TaskTags), so filtering by tag is expressed as a join condition.
        const tagsInclude = tagId
            ? { model: TagModel, as: 'tags' as const, where: { id: tagId }, required: true }
            : { model: TagModel, as: 'tags' as const };

        const options: FindOptions = {
            where: whereOptions,
            limit,
            offset,
            order: [[String(sortBy), String(sortOrder)]],
            include: [
                tagsInclude,
                { model: UserModel, as: 'creator' },
                { model: UserModel, as: 'assignee' },
            ],
        };

        const tasks = await TaskModel.findAll(options);
        const total = await TaskModel.count({ where: whereOptions, include: tagId ? [tagsInclude] : [] });
    
        return {
            total,
            page,
            limit,
            data: tasks,
        };
    }

    async deleteTaskById(taskId: string): Promise<number> {
        return await TaskModel.destroy({ where: { id: taskId } });
    }
    
}
