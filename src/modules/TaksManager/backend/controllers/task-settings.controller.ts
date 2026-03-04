import { TaskSettings } from '../domain/task-settings.entity';
import { TaskSettingsService } from '../services/task-settings.service';
import { UpdateTaskSettingsData } from '../ports/task-settings.port';

export class TaskSettingsController {
    private readonly taskSettingsService: TaskSettingsService;

    constructor(taskSettingsService: TaskSettingsService) {
        this.taskSettingsService = taskSettingsService;
    }

    async handleGetSettings(): Promise<TaskSettings> {
        return this.taskSettingsService.getSettings();
    }

    async handleUpdateSettings(payload: UpdateTaskSettingsData): Promise<TaskSettings> {
        return this.taskSettingsService.updateSettings(payload);
    }
}
