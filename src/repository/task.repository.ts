// src/repository/task.repository.ts
import TaskModel from '../db/models/taskmodel';
import { TaskAttributes } from '../interfaces/task.interface';

export class TaskRepository {
    public async createTask(taskData: TaskAttributes): Promise<TaskModel> {
        return await TaskModel.create(taskData);
    }

    public async findById(taskId: string): Promise<TaskModel | null> {
        return await TaskModel.findByPk(taskId);
    }
}
