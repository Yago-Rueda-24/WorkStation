import { CuentaCorriente } from '../../types/finance.types';

interface CuentaCardProps {
    cuenta: CuentaCorriente;
    carteraNombre: string | null;
    confirmDeleteId: number | null;
    onEdit: (cuenta: CuentaCorriente) => void;
    onRequestDelete: (id: number) => void;
    onCancelDelete: () => void;
    onConfirmDelete: (id: number) => void;
}

const formatCurrency = (value: number, moneda: string) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: moneda }).format(value);

const formatIban = (iban: string) =>
    iban.replace(/(.{4})/g, '$1 ').trim();

const CuentaCard = ({
    cuenta,
    carteraNombre,
    confirmDeleteId,
    onEdit,
    onRequestDelete,
    onCancelDelete,
    onConfirmDelete,
}: CuentaCardProps) => {
    const confirmando = confirmDeleteId === cuenta.id;

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
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/15
                        flex items-center justify-center text-blue-400 flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{cuenta.nombre}</h3>
                        {cuenta.banco && (
                            <p className="text-xs text-slate-500 truncate mt-0.5">{cuenta.banco}</p>
                        )}
                    </div>
                </div>

                {/* Actions — dos pasos o botones de acción */}
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
                            onClick={() => onConfirmDelete(cuenta.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold
                                text-red-400 bg-red-500/10 border border-red-500/20
                                hover:bg-red-500/20 transition-colors"
                        >
                            Eliminar
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                        {/* Editar */}
                        <button
                            onClick={() => onEdit(cuenta)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center
                                text-slate-500 hover:text-blue-400 hover:bg-blue-500/10
                                transition-all duration-150"
                            title="Editar cuenta"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                        {/* Eliminar */}
                        <button
                            onClick={() => onRequestDelete(cuenta.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center
                                text-slate-500 hover:text-red-400 hover:bg-red-500/10
                                transition-all duration-150"
                            title="Eliminar cuenta"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4h6v2" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Saldo */}
            <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Saldo</span>
                <span className={`text-2xl font-bold tracking-tight ${cuenta.saldo >= 0 ? 'text-white' : 'text-red-400'}`}>
                    {formatCurrency(cuenta.saldo, cuenta.moneda)}
                </span>
            </div>

            {/* IBAN */}
            {cuenta.iban && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/3 rounded-xl border border-white/5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                    <span className="text-xs font-mono text-slate-400 tracking-wider truncate">
                        {formatIban(cuenta.iban)}
                    </span>
                </div>
            )}

            {/* Footer: moneda + cartera */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold
                    bg-slate-700/50 text-slate-400 border border-white/5">
                    {cuenta.moneda}
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
        </div>
    );
};

export default CuentaCard;
