
import { BaseModule } from '../../shared/domain/ports/module.port';
import { TaskController } from './backend/controllers/task.controller';
import { TaskService } from './backend/services/task.service';
import { TaskRepository } from './backend/infraestrucuture/task.repository';
import { AppDataSource } from '../../core/backend/database';

export class TaskManagerModule extends BaseModule {
    readonly prefix = 'taskmanager';
    private controller: TaskController;

    constructor() {
        super();
        const repository = new TaskRepository(AppDataSource);
        const service = new TaskService(repository);
        this.controller = new TaskController(service);
    }

    getHandlers(): Record<string, Function> {
        const handlers: Record<string, Function> = {};
        Object.getOwnPropertyNames(TaskController.prototype)
            .filter(name => name !== 'constructor')
            .forEach(name => {
                handlers[name] = (this.controller as any)[name].bind(this.controller);
            });
        return handlers;
    }
}