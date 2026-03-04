import { DataSource, Repository } from 'typeorm';
import { Task, TaskStatus } from '../domain/task.entity';
import { ITaskPort, CreateTaskData, UpdateTaskData } from '../ports/task.port';

export class TaskRepository implements ITaskPort {
    private readonly repository: Repository<Task>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Task);
    }

    async findAll(): Promise<Task[]> {
        return this.repository.find({
            relations: { tag: true },
            order: { createdAt: 'DESC' }
        });
    }

    async findById(id: number): Promise<Task | null> {
        return this.repository.findOne({
            where: { id },
            relations: { tag: true }
        });
    }


    async create(data: CreateTaskData): Promise<Task> {
        const { tagId, ...rest } = data;
        const task = this.repository.create(rest);
        if (tagId !== undefined) {
            task.tag = tagId ? { id: tagId } as any : null;
        }
        return this.repository.save(task);
    }

    async update(id: number, data: UpdateTaskData): Promise<Task | null> {
        const { tagId, ...rest } = data;
        const task = await this.repository.findOneBy({ id });
        if (!task) return null;

        Object.assign(task, rest);
        if (tagId !== undefined) {
            task.tag = tagId ? { id: tagId } as any : null;
        }
        return this.repository.save(task);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }

    async deleteCompletedTasks(): Promise<boolean> {
        const result = await this.repository.delete({ status: TaskStatus.DONE });
        return (result.affected ?? 0) > 0;
    }
}
