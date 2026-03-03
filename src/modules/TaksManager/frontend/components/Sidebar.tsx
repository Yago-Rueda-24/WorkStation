import React from 'react';

export type TaskFilter = 'all' | 'pending' | 'in_progress' | 'done';
export type ViewMode = 'list' | 'calendar' | 'kanban' | 'tags';

interface SidebarProps {
    currentFilter: TaskFilter;
    activeView: ViewMode;
    onFilterChange: (filter: TaskFilter) => void;
    onViewChange: (view: ViewMode) => void;
    onNewTask: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentFilter, activeView, onFilterChange, onViewChange, onNewTask }) => {
    const filterItems = [
        {
            id: 'all', label: 'All Tasks', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            )
        },
        {
            id: 'pending', label: 'Pending', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            )
        },
        {
            id: 'in_progress', label: 'In Progress', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
            )
        },
        {
            id: 'done', label: 'Done', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            )
        }
    ];

    const handleFilterClick = (filterId: TaskFilter) => {
        onFilterChange(filterId);
        onViewChange('list');
    };

    const handleCalendarClick = () => {
        onViewChange('calendar');
    };

    const handleKanbanClick = () => {
        onViewChange('kanban');
    };

    return (
        <aside className="w-64 flex-shrink-0 flex flex-col gap-2 relative z-10 h-full pt-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex-1 flex flex-col">
                <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-4 px-2">Navigation</h3>
                <nav className="flex flex-col gap-1">
                    {filterItems.map(item => {
                        const isActive = activeView === 'list' && currentFilter === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleFilterClick(item.id as TaskFilter)}
                                className={`
                                    flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                    ${isActive
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:cursor-pointer'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent hover:cursor-pointer'
                                    }
                                `}
                            >
                                <span className={`${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]"></span>
                                )}
                            </button>
                        );
                    })}

                    {/* Separator */}
                    <div className="my-2 border-t border-white/5" />

                    {/* Calendar button */}
                    <button
                        onClick={handleCalendarClick}
                        className={`
                            flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                            ${activeView === 'calendar'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:cursor-pointer'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent hover:cursor-pointer'
                            }
                        `}
                    >
                        <span className={`${activeView === 'calendar' ? 'text-blue-400' : 'text-slate-400'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </span>
                        Calendar
                        {activeView === 'calendar' && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]"></span>
                        )}
                    </button>

                    {/* Kanban button */}
                    <button
                        onClick={handleKanbanClick}
                        className={`
                            flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                            ${activeView === 'kanban'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:cursor-pointer'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent hover:cursor-pointer'
                            }
                        `}
                    >
                        <span className={`${activeView === 'kanban' ? 'text-blue-400' : 'text-slate-400'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                        </span>
                        Kanban
                        {activeView === 'kanban' && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]"></span>
                        )}
                    </button>

                    {/* Tags button */}
                    <button
                        onClick={() => onViewChange('tags')}
                        className={`
                            flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                            ${activeView === 'tags'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:cursor-pointer'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent hover:cursor-pointer'
                            }
                        `}
                    >
                        <span className={`${activeView === 'tags' ? 'text-blue-400' : 'text-slate-400'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        </span>
                        Tags
                        {activeView === 'tags' && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]"></span>
                        )}
                    </button>
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <button
                        onClick={onNewTask}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        New Task
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
