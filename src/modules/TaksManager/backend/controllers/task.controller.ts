import { Task, TaskStatus } from '../domain/task.entity';
import { TaskService } from '../services/task.service';

export class TaskController {
    private readonly taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }

    async handleGetAll(): Promise<Task[]> {
        return this.taskService.getAll();
    }

    async handleGetById(payload: { id: number }): Promise<Task | null> {
        return this.taskService.getById(payload.id);
    }

    async handleCreate(payload: { title: string; description?: string; status?: TaskStatus }): Promise<Task> {
        return this.taskService.create(payload);
    }

    async handleUpdate(payload: { id: number; title?: string; completed?: boolean; description?: string; status?: TaskStatus }): Promise<Task | null> {
        const { id, ...data } = payload;
        return this.taskService.update(id, data);
    }

    async handleDelete(payload: { id: number }): Promise<boolean> {
        return this.taskService.delete(payload.id);
    }
}
