import { DataSource, Repository } from 'typeorm';
import { TaskSettings } from '../domain/task-settings.entity';
import { ITaskSettingsPort, UpdateTaskSettingsData } from '../ports/task-settings.port';

export class TaskSettingsRepository implements ITaskSettingsPort {
    private readonly repository: Repository<TaskSettings>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(TaskSettings);
    }

    async getSettings(): Promise<TaskSettings | null> {
        return this.repository.findOne({ where: {} });
    }

    async createSettings(data: UpdateTaskSettingsData): Promise<TaskSettings> {
        const settings = this.repository.create(data);
        return this.repository.save(settings);
    }

    async updateSettings(id: number, data: UpdateTaskSettingsData): Promise<TaskSettings | null> {
        const settings = await this.repository.findOneBy({ id });
        if (!settings) return null;

        Object.assign(settings, data);
        return this.repository.save(settings);
    }
}
