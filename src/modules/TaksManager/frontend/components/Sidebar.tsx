import React from 'react';

export type TaskFilter = 'all' | 'pending' | 'in_progress' | 'done';

interface SidebarProps {
    currentFilter: TaskFilter;
    onFilterChange: (filter: TaskFilter) => void;
    onNewTask: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentFilter, onFilterChange, onNewTask }) => {
    const navItems = [
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

    return (
        <aside className="w-64 flex-shrink-0 flex flex-col gap-2 relative z-10 h-full pt-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex-1 flex flex-col">
                <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-4 px-2">Navigation</h3>
                <nav className="flex flex-col gap-1">
                    {navItems.map(item => {
                        const isActive = currentFilter === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onFilterChange(item.id as TaskFilter)}
                                className={`
                                    flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                    ${isActive
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
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
