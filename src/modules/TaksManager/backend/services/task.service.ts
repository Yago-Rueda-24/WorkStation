import { Task, TaskStatus } from '../domain/task.entity';
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

    async eliminateCompletedTasks(): Promise<void> {
        await this.taskPort.deleteCompletedTasks();
    }

    async create(data: CreateTaskData): Promise<Task> {
        return this.taskPort.create(data);
    }

    async update(id: number, data: UpdateTaskData): Promise<Task | null> {
        const existingTask = await this.getById(id);
        if (!existingTask) return null;

        const updatedData = { ...data };

        if (data.status === TaskStatus.DONE && existingTask.status !== TaskStatus.DONE) {
            updatedData.completedAt = new Date();
        } else if (data.status && data.status !== TaskStatus.DONE && existingTask.status === TaskStatus.DONE) {
            updatedData.completedAt = null;
        }

        return this.taskPort.update(id, updatedData);
    }

    async delete(id: number): Promise<boolean> {
        return this.taskPort.delete(id);
    }
}
