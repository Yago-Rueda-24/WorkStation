import SysInfo from '../../../modules/sysinfo/frontend/views/sysinfo'
import TaskManagerView from '../../../modules/TaksManager/frontend/views/TaskManagerView'
import Settings from '../../../modules/settings/frontend/views/Settings'
import type { ModuleDefinition } from './types'

/**
 * Registro central de módulos del frontend.
 * Para registrar un nuevo módulo, añadir una entrada a este array.
 * El resto de la aplicación (rutas, dashboard, menú) se actualiza solo.
 */
const modules: ModuleDefinition[] = [
    {
        id: 'tasks',
        title: 'Task Manager',
        description: 'Organize and track your tasks with boards, priorities and detailed panels.',
        route: '/tasks',
        color: 'text-purple-400',
        shadow: 'hover:shadow-purple-500/10',
        component: TaskManagerView,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
        )
    },
    {
        id: 'sysinfo',
        title: 'System Info',
        description: 'Real-time hardware monitoring: CPU, memory, GPU and disk usage with live charts.',
        route: '/sysinfo',
        color: 'text-teal-400',
        shadow: 'hover:shadow-teal-500/10',
        component: SysInfo,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="15" y1="2" x2="15" y2="4"></line>
                <line x1="9" y1="2" x2="9" y2="4"></line>
                <line x1="15" y1="20" x2="15" y2="22"></line>
                <line x1="9" y1="20" x2="9" y2="22"></line>
                <line x1="20" y1="15" x2="22" y2="15"></line>
                <line x1="20" y1="9" x2="22" y2="9"></line>
                <line x1="2" y1="15" x2="4" y2="15"></line>
                <line x1="2" y1="9" x2="4" y2="9"></line>
            </svg>
        )
    },
    {
        id: 'settings',
        title: 'Settings',
        description: 'Configure application preferences, appearance and system behaviour.',
        route: '/settings',
        color: 'text-slate-400',
        shadow: 'hover:shadow-slate-500/10',
        component: Settings,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
        )
    }
]

export default modules
