
import { BaseModule } from '../../shared/domain/ports/module.port';
import { TaskController } from './backend/controllers/task.controller';
import { TaskService } from './backend/services/task.service';
import { TaskRepository } from './backend/infraestrucuture/task.repository';
import { AppDataSource } from '../../core/backend/database';
import { TagController } from './backend/controllers/tag.controller';
import { TagService } from './backend/services/tag.service';
import { TagRepository } from './backend/infraestrucuture/tag.repository';
import { TaskSettingsController } from './backend/controllers/task-settings.controller';
import { TaskSettingsService } from './backend/services/task-settings.service';
import { TaskSettingsRepository } from './backend/infraestrucuture/task-settings.repository';

export class TaskManagerModule extends BaseModule {
    readonly prefix = 'taskmanager';
    private controller: TaskController;
    private tagController: TagController;
    private settingsController: TaskSettingsController;

    constructor() {
        super();
        const repository = new TaskRepository(AppDataSource);
        const settingsRepository = new TaskSettingsRepository(AppDataSource);
        const service = new TaskService(repository, settingsRepository);
        this.controller = new TaskController(service);

        const tagRepository = new TagRepository(AppDataSource);
        const tagService = new TagService(tagRepository);
        this.tagController = new TagController(tagService);

        const settingsService = new TaskSettingsService(settingsRepository);
        this.settingsController = new TaskSettingsController(settingsService);
    }

    getHandlers(): Record<string, Function> {
        const handlers: Record<string, Function> = {};
        Object.getOwnPropertyNames(TaskController.prototype)
            .filter(name => name !== 'constructor')
            .forEach(name => {
                handlers[name] = (this.controller as any)[name].bind(this.controller);
            });
        Object.getOwnPropertyNames(TagController.prototype)
            .filter(name => name !== 'constructor')
            .forEach(name => {
                handlers[name] = (this.tagController as any)[name].bind(this.tagController);
            });
        Object.getOwnPropertyNames(TaskSettingsController.prototype)
            .filter(name => name !== 'constructor')
            .forEach(name => {
                handlers[name] = (this.settingsController as any)[name].bind(this.settingsController);
            });
        return handlers;
    }
}