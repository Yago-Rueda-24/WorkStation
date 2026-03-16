import { Inversion, TipoInversion } from '../../types/finance.types';

// ─── Tipos helpers ────────────────────────────────────────────────────────────

interface TipoConfig {
    label: string;
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    icon: React.ReactNode;
}

const TIPO_CONFIG: Record<TipoInversion, TipoConfig> = {
    acciones: {
        label: 'Acciones',
        bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-300',
        iconBg: 'bg-blue-500/10', iconBorder: 'border-blue-500/15', iconColor: 'text-blue-400',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
            </svg>
        ),
    },
    fondos: {
        label: 'Fondos',
        bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-300',
        iconBg: 'bg-purple-500/10', iconBorder: 'border-purple-500/15', iconColor: 'text-purple-400',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
        ),
    },
    cripto: {
        label: 'Cripto',
        bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-300',
        iconBg: 'bg-amber-500/10', iconBorder: 'border-amber-500/15', iconColor: 'text-amber-400',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
    },
    deposito: {
        label: 'Depósito',
        bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-300',
        iconBg: 'bg-emerald-500/10', iconBorder: 'border-emerald-500/15', iconColor: 'text-emerald-400',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="22" x2="21" y2="22" /><rect x="6" y="2" width="12" height="20" rx="1" /><path d="M10 7h4M10 12h4" />
            </svg>
        ),
    },
    otro: {
        label: 'Otro',
        bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-300',
        iconBg: 'bg-slate-500/10', iconBorder: 'border-slate-500/15', iconColor: 'text-slate-400',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
        ),
    },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface InversionCardProps {
    inversion: Inversion;
    carteraNombre: string | null;
    confirmDeleteId: number | null;
    onEdit: (inversion: Inversion) => void;
    onRequestDelete: (id: number) => void;
    onCancelDelete: () => void;
    onConfirmDelete: (id: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (value: number, moneda: string) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: moneda }).format(value);

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
};

// ─── Component ────────────────────────────────────────────────────────────────

const InversionCard = ({
    inversion,
    carteraNombre,
    confirmDeleteId,
    onEdit,
    onRequestDelete,
    onCancelDelete,
    onConfirmDelete,
}: InversionCardProps) => {
    const confirmando = confirmDeleteId === inversion.id;
    const cfg = TIPO_CONFIG[inversion.tipo] ?? TIPO_CONFIG.otro;
    const rentPos = inversion.rentabilidad >= 0;
    const ganancia = inversion.saldo - inversion.valorInicial;

    return (
        <div className={`group relative flex flex-col gap-4 bg-slate-800/50 backdrop-blur-xl
            border rounded-2xl p-5 transition-all duration-300
            hover:-translate-y-1 hover:shadow-xl
            ${confirmando
                ? 'border-red-500/30 shadow-red-500/5'
                : 'border-white/10 hover:border-white/20 hover:shadow-black/20'
            }`}>

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl ${cfg.iconBg} border ${cfg.iconBorder}
                        flex items-center justify-center ${cfg.iconColor} flex-shrink-0`}>
                        {cfg.icon}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{inversion.nombre}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5
                            ${cfg.bg} ${cfg.border} border ${cfg.text}`}>
                            {cfg.label}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                {confirmando ? (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                            onClick={onCancelDelete}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400
                                hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => onConfirmDelete(inversion.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold
                                text-red-400 bg-red-500/10 border border-red-500/20
                                hover:bg-red-500/20 transition-colors"
                        >
                            Eliminar
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                        <button
                            onClick={() => onEdit(inversion)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center
                                text-slate-500 hover:text-violet-400 hover:bg-violet-500/10
                                transition-all duration-150"
                            title="Editar inversión"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onRequestDelete(inversion.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center
                                text-slate-500 hover:text-red-400 hover:bg-red-500/10
                                transition-all duration-150"
                            title="Eliminar inversión"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Valor de mercado + Rentabilidad */}
            <div className="flex items-end justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Valor actual</span>
                    <span className="text-2xl font-bold text-white tracking-tight">
                        {formatCurrency(inversion.saldo, inversion.moneda)}
                    </span>
                </div>

                {inversion.valorInicial > 0 && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-sm
                        ${rentPos
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {rentPos
                                ? <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>
                                : <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>
                            }
                        </svg>
                        {rentPos ? '+' : ''}{inversion.rentabilidad.toFixed(2)}%
                    </div>
                )}
            </div>

            {/* Capital + Ganancia/Pérdida */}
            {inversion.valorInicial > 0 && (
                <div className="flex items-center justify-between px-3 py-2 bg-white/3 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-600">Capital invertido</span>
                        <span className="text-sm font-semibold text-slate-400">
                            {formatCurrency(inversion.valorInicial, inversion.moneda)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-xs text-slate-600">
                            {ganancia >= 0 ? 'Ganancia' : 'Pérdida'}
                        </span>
                        <span className={`text-sm font-semibold ${ganancia >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {ganancia >= 0 ? '+' : ''}{formatCurrency(ganancia, inversion.moneda)}
                        </span>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold
                        bg-slate-700/50 text-slate-400 border border-white/5">
                        {inversion.moneda}
                    </span>
                    {carteraNombre ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                            bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            {carteraNombre}
                        </span>
                    ) : (
                        <span className="text-xs text-slate-600 italic">Sin cartera</span>
                    )}
                </div>

                {inversion.fechaInicio && (
                    <span className="flex items-center gap-1 text-xs text-slate-600">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(inversion.fechaInicio)}
                    </span>
                )}
            </div>
        </div>
    );
};

export default InversionCard;
