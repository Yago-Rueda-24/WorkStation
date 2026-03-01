import React, { useState, useEffect } from 'react';

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'done';
    completed: boolean;
    dueDate: string | null;
    createdAt: string;
}

interface TaskDetailPanelProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedTask: Task) => void;
    onCreate: (newTask: { title: string; description: string; status: Task['status']; dueDate: string | null }) => void;
    onDelete: (taskId: number) => void;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task, isOpen, onClose, onSave, onCreate, onDelete }) => {
    const isCreateMode = task === null;
    const [editTask, setEditTask] = useState<Task | null>(null);

    useEffect(() => {
        if (isOpen) {
            setEditTask(task ? { ...task } : {
                id: 0,
                title: '',
                description: '',
                status: 'pending' as const,
                completed: false,
                dueDate: null,
                createdAt: new Date().toISOString(),
            });
        }
    }, [task, isOpen]);

    // Handle escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!editTask && !isOpen) return null;

    const handleChange = (field: keyof Task, value: string) => {
        if (editTask) {
            setEditTask({ ...editTask, [field]: value });
        }
    };

    const handleSave = () => {
        if (editTask) {
            if (isCreateMode) {
                onCreate({
                    title: editTask.title,
                    description: editTask.description ?? '',
                    status: editTask.status,
                    dueDate: editTask.dueDate,
                });
            } else {
                onSave(editTask);
            }
            onClose();
        }
    };

    const handleDelete = () => {
        if (editTask) {
            onDelete(editTask.id);
            onClose();
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`
                    fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ease-in-out
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={onClose}
            ></div>

            {/* Slide-in Panel from Right */}
            <div
                className={`
                    fixed top-[35px] right-0 bottom-0 w-full sm:w-[450px] bg-slate-900 border-l border-white/10 shadow-2xl z-[101]
                    transition-transform duration-300 ease-in-out flex flex-col
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800/50">
                    <h2 className="text-xl font-bold text-white m-0">{isCreateMode ? 'New Task' : 'Edit Task Details'}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {editTask && (
                        <>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-300">Title</label>
                                <input
                                    type="text"
                                    value={editTask.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="Task title..."
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-300">Description</label>
                                <textarea
                                    value={editTask.description ?? ''}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[150px] resize-y"
                                    placeholder="Detailed description of the task..."
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-300">Status</label>
                                <select
                                    value={editTask.status}
                                    onChange={(e) => handleChange('status', e.target.value as Task['status'])}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-300">Due Date</label>
                                <input
                                    type="date"
                                    value={editTask.dueDate ?? ''}
                                    onChange={(e) => handleChange('dueDate', e.target.value || null as any)}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium [color-scheme:dark]"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 bg-slate-800/30 flex justify-between">
                    {!isCreateMode ? (
                        <button
                            onClick={handleDelete}
                            className="px-5 py-2.5 rounded-xl font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                        >
                            Delete
                        </button>
                    ) : <div />}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
                        >
                            {isCreateMode ? 'Create Task' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskDetailPanel;
