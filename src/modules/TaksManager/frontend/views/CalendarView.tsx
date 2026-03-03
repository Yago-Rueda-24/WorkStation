import React, { useState, useMemo, useEffect } from 'react';
import { Task } from '../components/TaskDetailPanel';

interface CalendarViewProps {
    tasks: Task[];
    navigateToDate?: Date | null;
    onTaskClick: (task: Task) => void;
    onDeleteTask: (taskId: number) => void;
    onNewTask: () => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];



const getStatusBorder = (status: Task['status']) => {
    switch (status) {
        case 'done': return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
        case 'in_progress': return 'border-amber-500/40 bg-amber-500/10 text-amber-300';
        case 'pending': return 'border-slate-500/40 bg-slate-500/10 text-slate-300';
        default: return 'border-slate-500/40 bg-slate-500/10 text-slate-300';
    }
};

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, navigateToDate, onTaskClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (navigateToDate) {
            setCurrentDate(new Date(navigateToDate.getFullYear(), navigateToDate.getMonth(), 1));
        }
    }, [navigateToDate]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarData = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Monday = 0, Sunday = 6
        let startDow = firstDay.getDay() - 1;
        if (startDow < 0) startDow = 6;

        const cells: { day: number | null; date: Date | null }[] = [];

        // Leading blanks
        for (let i = 0; i < startDow; i++) {
            cells.push({ day: null, date: null });
        }

        // Days of month
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push({ day: d, date: new Date(year, month, d) });
        }

        // Trailing blanks to fill the last row
        while (cells.length % 7 !== 0) {
            cells.push({ day: null, date: null });
        }

        return cells;
    }, [year, month]);

    // Group tasks by dueDate string (YYYY-MM-DD)
    const tasksByDate = useMemo(() => {
        const map: Record<string, Task[]> = {};
        tasks.forEach(task => {
            if (!task.dueDate) return; // skip tasks without a due date
            // Use the dueDate string directly as the key (it's already YYYY-MM-DD from the date input)
            const key = task.dueDate;
            if (!map[key]) map[key] = [];
            map[key].push(task);
        });
        return map;
    }, [tasks]);

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-y-auto pr-2">
            {/* Header */}
            <header className="mb-6 text-left shrink-0 mt-6 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold m-0 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight capitalize">
                        {monthName}
                    </h1>
                    <p className="text-[#94a3b8] text-base mt-2">
                        Calendar view • {tasks.length} total task(s)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToPrevMonth}
                        className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </header>

            {/* Calendar Grid */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex-1 flex flex-col">
                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-white/10">
                    {DAYS_OF_WEEK.map(day => (
                        <div key={day} className="px-3 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 flex-1">
                    {calendarData.map((cell, idx) => {
                        if (cell.day === null) {
                            return (
                                <div key={`empty-${idx}`} className="border-b border-r border-white/5 bg-slate-900/30 min-h-[100px]" />
                            );
                        }

                        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
                        const dayTasks = tasksByDate[dateKey] || [];
                        const isToday = dateKey === todayKey;

                        return (
                            <div
                                key={dateKey}
                                className={`
                                    border-b border-r border-white/5 min-h-[100px] p-2 flex flex-col gap-1 transition-colors
                                    ${isToday ? 'bg-blue-500/5' : 'hover:bg-white/[0.02]'}
                                `}
                            >
                                {/* Day number */}
                                <span className={`
                                    text-xs font-bold self-end w-6 h-6 flex items-center justify-center rounded-full
                                    ${isToday
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                        : 'text-slate-400'
                                    }
                                `}>
                                    {cell.day}
                                </span>

                                {/* Tasks */}
                                <div className="flex flex-col gap-0.5 mt-1 overflow-hidden">
                                    {dayTasks.slice(0, 3).map(task => (
                                        <button
                                            key={task.id}
                                            onClick={() => onTaskClick(task)}
                                            className={`
                                                text-[10px] font-medium px-1.5 py-0.5 rounded border truncate text-left
                                                transition-all hover:brightness-125 cursor-pointer flex items-center gap-1
                                                ${getStatusBorder(task.status)}
                                            `}
                                            title={task.title}
                                        >
                                            {task.tag && (
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                                    style={{ backgroundColor: task.tag.color }}
                                                />
                                            )}
                                            <span className="truncate">{task.title}</span>
                                        </button>
                                    ))}
                                    {dayTasks.length > 3 && (
                                        <span className="text-[10px] text-slate-500 font-medium px-1.5">
                                            +{dayTasks.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
