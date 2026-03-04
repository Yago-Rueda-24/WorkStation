import { TaskSettings } from '../domain/task-settings.entity';
import { ITaskSettingsPort, UpdateTaskSettingsData } from '../ports/task-settings.port';

export class TaskSettingsService {
    private readonly taskSettingsPort: ITaskSettingsPort;

    constructor(taskSettingsPort: ITaskSettingsPort) {
        this.taskSettingsPort = taskSettingsPort;
    }

    async getSettings(): Promise<TaskSettings> {
        let settings = await this.taskSettingsPort.getSettings();

        if (!settings) {
            settings = await this.taskSettingsPort.createSettings({
                autoDeleteCompletedTasks: false,
                autoDeleteDaysPassed: 30
            });
        }

        return settings;
    }

    async updateSettings(data: UpdateTaskSettingsData): Promise<TaskSettings> {
        const currentSettings = await this.getSettings();
        const updated = await this.taskSettingsPort.updateSettings(currentSettings.id, data);

        if (!updated) {
            throw new Error('Could not update task settings');
        }

        return updated;
    }
}
