import { DataSource } from 'typeorm';
import { app } from 'electron';
import path from 'node:path';
import { Task } from '../../modules/TaksManager/backend/domain/task.entity';
import { Tag } from '../../modules/TaksManager/backend/domain/tag.entity';
import { TaskSettings } from '../../modules/TaksManager/backend/domain/task-settings.entity';
import { CuentaCorriente } from '../../modules/FinanceTracker/backend/domain/cuenta-corriente.entity';
import { Inversion } from '../../modules/FinanceTracker/backend/domain/inversion.entity';
import { Cartera } from '../../modules/FinanceTracker/backend/domain/cartera.entity';
import { Transaction } from '../../modules/FinanceTracker/backend/domain/transaction.entity';

const isDev = !!process.env['VITE_DEV_SERVER_URL'];
const dbPath = isDev
    ? path.join(process.cwd(), 'database.sqlite')
    : path.join(app.getPath('userData'), 'database.sqlite');

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    synchronize: true, // Solo en desarrollo — desactivar en producción
    logging: true,
    entities: [Task, Tag, TaskSettings, CuentaCorriente, Inversion, Cartera, Transaction],
});

export async function initDatabase(): Promise<void> {
    try {
        await AppDataSource.initialize();
        console.log('[Database] Initialized successfully at:', dbPath);
    } catch (error) {
        console.error('[Database] Failed to initialize:', error);
        throw error;
    }
}
