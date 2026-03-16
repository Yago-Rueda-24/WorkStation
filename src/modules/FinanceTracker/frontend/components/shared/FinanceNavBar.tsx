import { FinanceView } from '../../types/finance.types';
import { useNavigate } from 'react-router';

interface NavItem {
    id: FinanceView;
    label: string;
    icon: React.ReactNode;
    color: string;
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
        color: 'green',
    },
    {
        id: 'carteras',
        label: 'Carteras',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
        ),
        color: 'green',
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
        color: 'blue',
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
        color: 'purple',
    },
];

const FinanceNavBar = ({ activeView, onNavigate }: FinanceNavBarProps) => {

    const navigate = useNavigate();

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
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group border border-transparent hover:border-red-500/20"
                >
                    Dashboard
                </button>
            </div>

            {/* Separator */}
            <div className="w-px h-5 bg-white/10" />

            {/* Nav tabs */}
            <nav className="flex items-center gap-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeView === item.id;

                    const themes: Record<string, any> = {
                        green: {
                            text: 'text-green-400',
                            bg: 'bg-green-500/10',
                            border: 'border-green-500/20',
                            shadow: 'shadow-[0_0_12px_rgba(34,197,94,0.08)]',
                            dot: 'bg-green-400 shadow-[0_0_5px_rgba(34,197,94,0.8)]',
                            icon: 'text-green-400'
                        },
                        blue: {
                            text: 'text-blue-400',
                            bg: 'bg-blue-500/10',
                            border: 'border-blue-500/20',
                            shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.08)]',
                            dot: 'bg-blue-400 shadow-[0_0_5px_rgba(59,130,246,0.8)]',
                            icon: 'text-blue-400'
                        },
                        purple: {
                            text: 'text-purple-400',
                            bg: 'bg-purple-500/10',
                            border: 'border-purple-500/20',
                            shadow: 'shadow-[0_0_12px_rgba(168,85,247,0.08)]',
                            dot: 'bg-purple-400 shadow-[0_0_5px_rgba(168,85,247,0.8)]',
                            icon: 'text-purple-400'
                        }
                    };

                    const theme = themes[item.color] || themes.green;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`
                                flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium
                                transition-all duration-200
                                ${isActive
                                    ? `${theme.bg} ${theme.text} border ${theme.border} ${theme.shadow}`
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                                }
                            `}
                        >
                            <span className={`transition-colors duration-200 ${isActive ? theme.icon : 'text-slate-500'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                            {isActive && (
                                <span className={`ml-0.5 w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default FinanceNavBar;
