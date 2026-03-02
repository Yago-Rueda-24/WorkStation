import { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar, { TaskFilter, ViewMode } from '../components/Sidebar';
import TaskDetailPanel, { Task } from '../components/TaskDetailPanel';
import TaskListView from './TaskListView';
import CalendarView from './CalendarView';
import KanbanView from './KanbanView';

const api = (window as any).api.taskmanager;

function TaskManagerView() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentFilter, setCurrentFilter] = useState<TaskFilter>('all');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<ViewMode>('list');

    // ── Data fetching ──────────────────────────────────────────────
    const fetchTasks = useCallback(async () => {
        try {
            const data = await api.handleGetAll();
            setTasks(data);
        } catch (err) {
            console.error('[TaskManager] Failed to fetch tasks:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // ── CRUD handlers ──────────────────────────────────────────────
    const handleNewTask = () => {
        setEditingTask(null);
        setIsPanelOpen(true);
    };

    const handleCreateTask = async (newTask: { title: string; description: string; status: string; dueDate: string | null }) => {
        try {
            await api.handleCreate(newTask);
            await fetchTasks();
        } catch (err) {
            console.error('[TaskManager] Failed to create task:', err);
        }
    };

    const handleSaveTask = async (updatedTask: Task) => {
        try {
            await api.handleUpdate({
                id: updatedTask.id,
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                completed: updatedTask.status === 'done',
                dueDate: updatedTask.dueDate,
            });
            await fetchTasks();
        } catch (err) {
            console.error('[TaskManager] Failed to update task:', err);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await api.handleDelete({ id: taskId });
            await fetchTasks();
        } catch (err) {
            console.error('[TaskManager] Failed to delete task:', err);
        }
    };

    const handleStatusChange = async (taskId: number, newStatus: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        try {
            await api.handleUpdate({
                id: task.id,
                title: task.title,
                description: task.description,
                status: newStatus,
                completed: newStatus === 'done',
                dueDate: task.dueDate,
            });
            await fetchTasks();
        } catch (err) {
            console.error('[TaskManager] Failed to update task status:', err);
        }
    };

    // ── Panel handlers ─────────────────────────────────────────────
    const handleOpenPanel = (task: Task) => {
        setEditingTask(task);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setTimeout(() => setEditingTask(null), 300);
    };

    // ── Derived data ───────────────────────────────────────────────
    const filteredTasks = useMemo(() => {
        if (currentFilter === 'all') return tasks;
        return tasks.filter(task => task.status === currentFilter);
    }, [tasks, currentFilter]);

    // ── View rendering ─────────────────────────────────────────────
    const renderActiveView = () => {
        switch (activeView) {
            case 'calendar':
                return (
                    <CalendarView
                        tasks={tasks}
                        onTaskClick={handleOpenPanel}
                        onDeleteTask={handleDeleteTask}
                        onNewTask={handleNewTask}
                    />
                );
            case 'kanban':
                return (
                    <KanbanView
                        tasks={tasks}
                        onTaskClick={handleOpenPanel}
                        onDeleteTask={handleDeleteTask}
                        onNewTask={handleNewTask}
                        onStatusChange={handleStatusChange}
                    />
                );
            case 'list':
            default:
                return (
                    <TaskListView
                        tasks={filteredTasks}
                        loading={loading}
                        currentFilter={currentFilter}
                        onTaskClick={handleOpenPanel}
                        onDeleteTask={handleDeleteTask}
                    />
                );
        }
    };

    return (
        <main className="flex flex-1 w-full px-6 gap-6 relative min-h-0">
            <Sidebar
                currentFilter={currentFilter}
                activeView={activeView}
                onFilterChange={setCurrentFilter}
                onViewChange={setActiveView}
                onNewTask={handleNewTask}
            />

            {renderActiveView()}

            <TaskDetailPanel
                task={editingTask}
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                onSave={handleSaveTask}
                onCreate={handleCreateTask}
                onDelete={handleDeleteTask}
            />
        </main>
    );
}

export default TaskManagerView;
