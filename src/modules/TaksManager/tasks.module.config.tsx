import TaskManagerView from './frontend/views/TaskManagerView';
import { BaseFrontendConfig } from '../../core/registry/types.frontend';

class TaskManagerConfig extends BaseFrontendConfig {
    id = 'tasks';
    order = 2;
    title = 'Task Manager';
    description = 'Organize and track your tasks with boards, priorities and detailed panels.';
    route = '/tasks';
    color = 'text-purple-400';
    shadow = 'hover:shadow-purple-500/10';
    component = TaskManagerView;
    icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
    )
}

// Vite leerá esta instancia automáticamente
export const config = new TaskManagerConfig();
