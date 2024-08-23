import { ICore } from ".";
import TaskModel from "../db/models/taskmodel";

export interface TaskAttributes extends ICore {
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    createdById: string;
    assignedToId?: string; // Optional
    dueDate?: Date; // Optional
}

export interface CreateTaskInput {
    title: string;
    description: string;
    status?: 'Pending' | 'In Progress' | 'Completed'; // Optional, default to 'Pending'
    dueDate?: Date; // Optional
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: 'Pending' | 'In Progress' | 'Completed';
    assignedToId?: string; // Optional
}

// src/interfaces/task.interface.ts
export interface CreateTaskWithMeta extends CreateTaskInput {
    id?: string; // Optional if you are generating IDs automatically
    createdById?: string; // Optional
    assignedToId?: string; // Optional
}

export enum TaskStatus {
    Pending = 'Pending',
    InProgress = 'In Progress',
    Completed = 'Completed'
}

export interface GetTaskFilter {
    page?: number;
    limit?: number;
    sortBy?: string 
    sortOrder?: 'ASC' | 'DESC'; 
    status?: 'Pending' | 'In Progress' | 'Completed'; 
    createdById?: string; 
    assignedToId?: string; 
    dueDate?: Date; 
    tagId?: string;
}


