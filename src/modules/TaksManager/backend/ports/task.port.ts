import { Task, TaskStatus } from '../domain/task.entity';

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string | null;
}

export interface UpdateTaskData {
    title?: string;
    completed?: boolean;
    description?: string | null;
    status?: TaskStatus;
    dueDate?: string | null;
}

export interface ITaskPort {
    findAll(): Promise<Task[]>;
    findById(id: number): Promise<Task | null>;
    create(data: CreateTaskData): Promise<Task>;
    update(id: number, data: UpdateTaskData): Promise<Task | null>;
    delete(id: number): Promise<boolean>;
}
