import React, { useState } from 'react';
import { Task } from '../components/TaskDetailPanel';

interface KanbanViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onDeleteTask: (taskId: number) => void;
    onNewTask: () => void;
    onStatusChange: (taskId: number, newStatus: Task['status']) => void;
    onDeleteCompletedTasks: () => void;
}

type ColumnConfig = {
    status: Task['status'];
    title: string;
    emptyMessage: string;
    accentColor: string;
    headerBg: string;
    headerBorder: string;
    headerText: string;
    dotColor: string;
    badgeBg: string;
    badgeText: string;
    cardHoverShadow: string;
    cardHoverBorder: string;
    dropHighlight: string;
    icon: React.ReactNode;
};

const COLUMNS: ColumnConfig[] = [
    {
        status: 'pending',
        title: 'Pending',
        emptyMessage: 'No pending tasks',
        accentColor: 'slate',
        headerBg: 'bg-slate-500/10',
        headerBorder: 'border-slate-500/20',
        headerText: 'text-slate-300',
        dotColor: 'bg-slate-400',
        badgeBg: 'bg-slate-500/20',
        badgeText: 'text-slate-400',
        cardHoverShadow: 'hover:shadow-[0_0_20px_rgba(148,163,184,0.08)]',
        cardHoverBorder: 'hover:border-slate-500/20',
        dropHighlight: 'ring-2 ring-slate-400/40 bg-slate-500/10',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        status: 'in_progress',
        title: 'In Progress',
        emptyMessage: 'No tasks in progress',
        accentColor: 'amber',
        headerBg: 'bg-amber-500/10',
        headerBorder: 'border-amber-500/20',
        headerText: 'text-amber-300',
        dotColor: 'bg-amber-400',
        badgeBg: 'bg-amber-500/20',
        badgeText: 'text-amber-400',
        cardHoverShadow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]',
        cardHoverBorder: 'hover:border-amber-500/20',
        dropHighlight: 'ring-2 ring-amber-400/40 bg-amber-500/10',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" />
            </svg>
        ),
    },
    {
        status: 'done',
        title: 'Done',
        emptyMessage: 'No completed tasks',
        accentColor: 'emerald',
        headerBg: 'bg-emerald-500/10',
        headerBorder: 'border-emerald-500/20',
        headerText: 'text-emerald-300',
        dotColor: 'bg-emerald-400',
        badgeBg: 'bg-emerald-500/20',
        badgeText: 'text-emerald-400',
        cardHoverShadow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]',
        cardHoverBorder: 'hover:border-emerald-500/20',
        dropHighlight: 'ring-2 ring-emerald-400/40 bg-emerald-500/10',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
];

const formatDate = (dateString: string) => {
    const [y, m, d] = dateString.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(date);
};

const KanbanView: React.FC<KanbanViewProps> = ({ tasks, onTaskClick, onDeleteTask, onStatusChange, onDeleteCompletedTasks }) => {
    const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
    const [dropTarget, setDropTarget] = useState<Task['status'] | null>(null);

    const tasksByStatus = COLUMNS.map(col => ({
        ...col,
        tasks: tasks.filter(t => t.status === col.status),
    }));

    // --- Drag handlers ---
    const handleDragStart = (e: React.DragEvent, taskId: number) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(taskId));
        // Make the ghost slightly transparent
        if (e.currentTarget instanceof HTMLElement) {
            requestAnimationFrame(() => {
                (e.currentTarget as HTMLElement).style.opacity = '0.4';
            });
        }
    };

    const handleDragEnd = (e: React.DragEvent) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '1';
        }
        setDraggedTaskId(null);
        setDropTarget(null);
    };

    const handleDragOver = (e: React.DragEvent, columnStatus: Task['status']) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDropTarget(columnStatus);
    };

    const handleDragLeave = (e: React.DragEvent, columnStatus: Task['status']) => {
        // Only clear if we're actually leaving the column (not entering a child)
        const relatedTarget = e.relatedTarget as HTMLElement | null;
        if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
            if (dropTarget === columnStatus) {
                setDropTarget(null);
            }
        }
    };

    const handleDrop = (e: React.DragEvent, columnStatus: Task['status']) => {
        e.preventDefault();
        setDropTarget(null);

        const taskId = Number(e.dataTransfer.getData('text/plain'));
        if (!taskId || isNaN(taskId)) return;

        const task = tasks.find(t => t.id === taskId);
        if (!task || task.status === columnStatus) return;

        onStatusChange(taskId, columnStatus);
    };

    return (
        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden pr-2">
            {/* Header */}
            <header className="mb-6 text-left shrink-0 mt-6">
                <h1 className="text-4xl font-extrabold m-0 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                    Kanban Board
                </h1>
                <p className="text-[#94a3b8] text-base mt-2 flex items-center gap-2">
                    <span>Visualiza tus tareas por estado.</span>
                    <span className="opacity-50">•</span>
                    <span>{tasks.length} task(s) total</span>
                    <span className="opacity-50">•</span>
                    <span className="text-blue-400/70 text-sm">Drag & drop to change status</span>
                    <span className="opacity-50">•</span>
                    <button
                        onClick={onDeleteCompletedTasks}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30"
                        title="Delete all completed tasks"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        <span>Clear Done</span>
                    </button>
                </p>
            </header>

            {/* Kanban Columns */}
            <div className="flex gap-4 flex-1 min-h-0 overflow-x-auto pb-2">
                {tasksByStatus.map(column => {
                    const isDropTarget = dropTarget === column.status && draggedTaskId !== null;

                    return (
                        <div
                            key={column.status}
                            className={`flex flex-col flex-1 min-w-[280px] bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-200 ${isDropTarget ? column.dropHighlight : ''}`}
                            onDragOver={(e) => handleDragOver(e, column.status)}
                            onDragLeave={(e) => handleDragLeave(e, column.status)}
                            onDrop={(e) => handleDrop(e, column.status)}
                        >
                            {/* Column Header */}
                            <div className={`flex items-center gap-3 px-4 py-3 border-b ${column.headerBorder} ${column.headerBg}`}>
                                <span className={`w-2 h-2 rounded-full ${column.dotColor} shadow-lg`} />
                                <span className={`${column.headerText} font-bold text-sm`}>
                                    {column.icon}
                                </span>
                                <span className={`${column.headerText} font-bold text-sm`}>
                                    {column.title}
                                </span>
                                <span className={`ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold ${column.badgeBg} ${column.badgeText}`}>
                                    {column.tasks.length}
                                </span>
                            </div>

                            {/* Column Body */}
                            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                                {column.tasks.length === 0 ? (
                                    <div className={`flex-1 flex flex-col items-center justify-center py-8 rounded-xl transition-all duration-200 ${isDropTarget ? 'text-blue-400' : 'text-slate-500'}`}>
                                        {isDropTarget ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 animate-bounce">
                                                    <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
                                                </svg>
                                                <span className="text-xs font-bold">Drop here</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-40">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                                                </svg>
                                                <span className="text-xs font-medium">{column.emptyMessage}</span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    column.tasks.map(task => {
                                        const isDragging = draggedTaskId === task.id;
                                        return (
                                            <div
                                                key={task.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                onDragEnd={handleDragEnd}
                                                className={`relative bg-slate-800/60 border border-white/10 rounded-xl p-4 transition-all duration-200 ${column.cardHoverShadow} ${column.cardHoverBorder} hover:bg-slate-800/80 group cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-40 scale-95' : ''}`}
                                            >
                                                {/* Drag Handle + Title */}
                                                <div className="flex items-start">
                                                    <span className="absolute left-1.5 top-4.5 text-slate-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                            <circle cx="9" cy="5" r="2" /><circle cx="15" cy="5" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="9" cy="19" r="2" /><circle cx="15" cy="19" r="2" />
                                                        </svg>
                                                    </span>
                                                    <h3 className="text-sm font-bold text-[#f8fafc] m-0 leading-snug flex-1">
                                                        {task.title}
                                                    </h3>
                                                </div>

                                                {/* Task Description */}
                                                {task.description && (
                                                    <p className="text-[#94a3b8] text-xs leading-relaxed m-0 mt-2 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}

                                                {task.tag && (
                                                    <div className="mt-2 flex">
                                                        <span
                                                            className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border"
                                                            style={{
                                                                backgroundColor: `${task.tag.color}15`,
                                                                color: task.tag.color,
                                                                borderColor: `${task.tag.color}30`
                                                            }}
                                                        >
                                                            {task.tag.name}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Task Footer */}
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                                    {task.dueDate ? (
                                                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                                            </svg>
                                                            {formatDate(task.dueDate)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-500 italic">No date</span>
                                                    )}

                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            onClick={() => onTaskClick(task)}
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                                            title="View details"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => onDeleteTask(task.id)}
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                            title="Delete task"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KanbanView;
