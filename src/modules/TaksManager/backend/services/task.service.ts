import { Task } from '../domain/task.entity';
import { ITaskPort, CreateTaskData, UpdateTaskData } from '../ports/task.port';

export class TaskService {
    private readonly taskPort: ITaskPort;

    constructor(taskPort: ITaskPort) {
        this.taskPort = taskPort;
    }

    async getAll(): Promise<Task[]> {
        return this.taskPort.findAll();
    }

    async getById(id: number): Promise<Task | null> {
        return this.taskPort.findById(id);
    }

    async create(data: CreateTaskData): Promise<Task> {
        return this.taskPort.create(data);
    }

    async update(id: number, data: UpdateTaskData): Promise<Task | null> {
        return this.taskPort.update(id, data);
    }

    async delete(id: number): Promise<boolean> {
        return this.taskPort.delete(id);
    }
}
