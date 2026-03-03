import { Task } from '../components/TaskDetailPanel';

interface TaskListViewProps {
    tasks: Task[];
    loading: boolean;
    currentFilter: string;
    onTaskClick: (task: Task) => void;
    onDeleteTask: (taskId: number) => void;
}

const getStatusColor = (status: Task['status']) => {
    switch (status) {
        case 'done': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        case 'in_progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case 'pending': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
};

const getStatusLabel = (status: Task['status']) => {
    switch (status) {
        case 'done': return 'Done';
        case 'in_progress': return 'In Progress';
        case 'pending': return 'Pending';
        default: return 'Unknown';
    }
};

const formatDate = (dateString: string) => {
    const [y, m, d] = dateString.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
};

function TaskListView({ tasks, loading, currentFilter, onTaskClick, onDeleteTask }: TaskListViewProps) {
    return (
        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-y-auto pr-2">
            <header className="mb-6 text-left shrink-0 mt-6">
                <h1 className="text-4xl font-extrabold m-0 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">Tasks</h1>
                <p className="text-[#94a3b8] text-base mt-2 flex items-center gap-2">
                    <span>Gestiona tus tareas diarias.</span>
                    <span className="opacity-50">•</span>
                    <span>Showing {tasks.length} {currentFilter !== 'all' ? currentFilter : ''} task(s)</span>
                </p>
            </header>

            <div className="flex flex-col gap-4 w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                        <span className="text-sm">Loading tasks...</span>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-slate-800/30 border border-white/5 rounded-2xl text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-slate-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <h3 className="text-lg font-medium text-slate-300">No tasks found</h3>
                        <p className="text-sm mt-1">There are no tasks matching the current filter.</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div
                            key={task.id}
                            className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all duration-200 ease-in-out hover:shadow-[0_0_30px_rgba(59,130,246,0.12)] hover:border-blue-500/20 hover:bg-slate-800/70 shrink-0 cursor-default"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-[#f8fafc] m-0">{task.title}</h2>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                                                {getStatusLabel(task.status)}
                                            </span>
                                            {task.tag && (
                                                <span
                                                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                                                    style={{
                                                        backgroundColor: `${task.tag.color}15`,
                                                        color: task.tag.color,
                                                        borderColor: `${task.tag.color}30`
                                                    }}
                                                >
                                                    {task.tag.name}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                {task.dueDate ? formatDate(task.dueDate) : 'No date'}
                                            </span>
                                        </div>
                                    </div>

                                    {task.description && (
                                        <p className="text-[#94a3b8] text-sm leading-relaxed m-0">
                                            {task.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 self-start md:self-center">
                                    <button
                                        onClick={() => onTaskClick(task)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold justify-center md:w-auto transition-all duration-200 bg-white/5 hover:bg-white/10 text-blue-400 hover:text-blue-300 border border-white/5 hover:border-white/10"
                                    >
                                        <span>Details</span>
                                    </button>
                                    <button
                                        onClick={() => onDeleteTask(task.id)}
                                        className="flex items-center justify-center p-2 rounded-xl transition-all duration-200 bg-white/5 hover:bg-red-500/15 text-slate-400 hover:text-red-400 border border-white/5 hover:border-red-500/20"
                                        title="Delete task"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TaskListView;
