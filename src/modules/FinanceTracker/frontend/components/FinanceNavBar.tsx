export type FinanceView = 'dashboard' | 'cuentas' | 'inversiones' | 'carteras';

interface NavItem {
    id: FinanceView;
    label: string;
    icon: React.ReactNode;
}

interface FinanceNavBarProps {
    activeView: FinanceView;
    onNavigate: (view: FinanceView) => void;
}

const NAV_ITEMS: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Resumen',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        id: 'carteras',
        label: 'Carteras',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
        ),
    },
    {
        id: 'cuentas',
        label: 'Cuentas',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
        ),
    },
    {
        id: 'inversiones',
        label: 'Inversiones',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
            </svg>
        ),
    },

];

const FinanceNavBar = ({ activeView, onNavigate }: FinanceNavBarProps) => {
    return (
        <div className="flex items-center gap-6 px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
            {/* Module title */}
            <div className="flex items-center gap-2.5 mr-2">
                <div className="w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center text-green-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>
                <span className="text-sm font-bold text-white/80 tracking-tight">Finance Tracker</span>
            </div>

            {/* Separator */}
            <div className="w-px h-5 bg-white/10" />

            {/* Nav tabs */}
            <nav className="flex items-center gap-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`
                                flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium
                                transition-all duration-200
                                ${isActive
                                    ? 'bg-green-500/15 text-green-400 border border-green-500/25 shadow-[0_0_12px_rgba(34,197,94,0.08)]'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                                }
                            `}
                        >
                            <span className={`transition-colors duration-200 ${isActive ? 'text-green-400' : 'text-slate-500'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                            {isActive && (
                                <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default FinanceNavBar;
