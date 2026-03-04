import { TaskSettings } from '../domain/task-settings.entity';

export interface UpdateTaskSettingsData {
    autoDeleteCompletedTasks?: boolean;
    autoDeleteDaysPassed?: number;
}

export interface ITaskSettingsPort {
    getSettings(): Promise<TaskSettings | null>;
    createSettings(data: UpdateTaskSettingsData): Promise<TaskSettings>;
    updateSettings(id: number, data: UpdateTaskSettingsData): Promise<TaskSettings | null>;
}
