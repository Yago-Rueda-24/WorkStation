import { Task, TaskStatus } from '../domain/task.entity';
import { TaskService } from '../services/task.service';

export class TaskController {
    private readonly taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }

    /**
     * Serializes a Task so that Date fields become proper ISO 8601 strings.
     * Explicitly maps each field since spread on TypeORM entity instances
     * may not copy decorator-defined properties correctly.
     */
    private serialize(task: Task): Record<string, unknown> {
        const createdAtStr = task.createdAt instanceof Date
            ? task.createdAt.toISOString()
            : new Date(String(task.createdAt)).toISOString();
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            status: task.status,
            dueDate: task.dueDate,
            createdAt: createdAtStr,
        };
    }

    async handleGetAll(): Promise<Record<string, unknown>[]> {
        const tasks = await this.taskService.getAll();
        return tasks.map(t => this.serialize(t));
    }

    async handleGetById(payload: { id: number }): Promise<Record<string, unknown> | null> {
        const task = await this.taskService.getById(payload.id);
        return task ? this.serialize(task) : null;
    }

    async handleCreate(payload: { title: string; description?: string; status?: TaskStatus; dueDate?: string | null }): Promise<Record<string, unknown>> {
        const task = await this.taskService.create(payload);
        return this.serialize(task);
    }

    async handleUpdate(payload: { id: number; title?: string; completed?: boolean; description?: string; status?: TaskStatus; dueDate?: string | null }): Promise<Record<string, unknown> | null> {
        const { id, ...data } = payload;
        const task = await this.taskService.update(id, data);
        return task ? this.serialize(task) : null;
    }

    async handleDelete(payload: { id: number }): Promise<boolean> {
        return this.taskService.delete(payload.id);
    }
}
