import { DataSource, Repository } from 'typeorm';
import { Task } from '../domain/task.entity';
import { ITaskPort, CreateTaskData, UpdateTaskData } from '../ports/task.port';

export class TaskRepository implements ITaskPort {
    private readonly repository: Repository<Task>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Task);
    }

    async findAll(): Promise<Task[]> {
        return this.repository.find({ order: { createdAt: 'DESC' } });
    }

    async findById(id: number): Promise<Task | null> {
        return this.repository.findOneBy({ id });
    }

    async create(data: CreateTaskData): Promise<Task> {
        const task = this.repository.create(data);
        return this.repository.save(task);
    }

    async update(id: number, data: UpdateTaskData): Promise<Task | null> {
        const task = await this.repository.findOneBy({ id });
        if (!task) return null;

        Object.assign(task, data);
        return this.repository.save(task);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}
