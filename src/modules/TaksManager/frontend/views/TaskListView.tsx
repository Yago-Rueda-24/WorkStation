import { useState, useMemo } from 'react';
import Sidebar, { TaskFilter } from '../components/Sidebar';
import TaskDetailPanel, { Task as PanelTask } from '../components/TaskDetailPanel';

interface Task extends PanelTask { }

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
}

const MOCK_TASKS: Task[] = [
    {
        id: '1',
        title: 'Design Authentication Flow',
        description: 'Create wireframes and user flows for the new login and registration process, including OAuth integration.',
        dueDate: '2026-03-05T10:00:00Z',
        status: 'in-progress'
    },
    {
        id: '2',
        title: 'Optimize Database Queries',
        description: 'Review and optimize slow running queries in the users and orders tables to improve dashboard loading times.',
        dueDate: '2026-03-02T15:00:00Z',
        status: 'pending'
    },
    {
        id: '3',
        title: 'Update Package Dependencies',
        description: 'Audit and update npm packages to latest stable versions to address security vulnerabilities.',
        dueDate: '2026-02-28T18:00:00Z',
        status: 'completed'
    },
    {
        id: '4',
        title: 'Implement Dark Mode',
        description: 'Ensure all components adapt correctly to the new system-wide dark mode theme settings.',
        dueDate: '2026-03-10T09:00:00Z',
        status: 'pending'
    }
];

function TaskListView() {
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [currentFilter, setCurrentFilter] = useState<TaskFilter>('all');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const handleSaveTask = (updatedTask: Task) => {
        setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const handleOpenPanel = (task: Task) => {
        setEditingTask(task);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        // Small delay to allow slide animation to finish before clearing data
        setTimeout(() => setEditingTask(null), 300);
    };

    const filteredTasks = useMemo(() => {
        if (currentFilter === 'all') return tasks;
        return tasks.filter(task => task.status === currentFilter);
    }, [tasks, currentFilter]);

    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'pending': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const getStatusLabel = (status: Task['status']) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in-progress': return 'In Progress';
            case 'pending': return 'Pending';
            default: return 'Unknown';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    return (
        <main className="flex flex-1 w-full px-6 gap-6 relative min-h-0 h-[calc(100vh-[35px])]">
            <Sidebar currentFilter={currentFilter} onFilterChange={setCurrentFilter} />

            <div className="flex flex-col flex-1 pb-8 min-w-0 h-full overflow-y-auto pr-2">
                <header className="mb-6 text-left shrink-0 mt-6">
                    <h1 className="text-4xl font-extrabold m-0 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">Tasks</h1>
                    <p className="text-[#94a3b8] text-base mt-2 flex items-center gap-2">
                        <span>Gestiona tus tareas diarias.</span>
                        <span className="opacity-50">•</span>
                        <span>Showing {filteredTasks.length} {currentFilter !== 'all' ? currentFilter : ''} task(s)</span>
                    </p>
                </header>

                <div className="flex flex-col gap-4 w-full">
                    {filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-slate-800/30 border border-white/5 rounded-2xl text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-slate-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <h3 className="text-lg font-medium text-slate-300">No tasks found</h3>
                            <p className="text-sm mt-1">There are no tasks matching the current filter.</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all duration-200 ease-in-out hover:shadow-[0_0_30px_rgba(59,130,246,0.12)] hover:border-blue-500/20 hover:bg-slate-800/70 shrink-0 cursor-default"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-bold text-[#f8fafc] m-0">{task.title}</h2>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                                                {getStatusLabel(task.status)}
                                            </span>
                                        </div>

                                        <p className="text-[#94a3b8] text-sm leading-relaxed m-0">
                                            {task.description}
                                        </p>

                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            <span>Due: {formatDate(task.dueDate)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center self-start md:self-center">
                                        <button
                                            onClick={() => handleOpenPanel(task)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold w-full justify-center md:w-auto transition-all duration-200 bg-white/5 hover:bg-white/10 text-blue-400 hover:text-blue-300 border border-white/5 hover:border-white/10"
                                        >
                                            <span>Details</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <TaskDetailPanel
                task={editingTask}
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveTask}
            />
        </main>
    );
}

export default TaskListView;
