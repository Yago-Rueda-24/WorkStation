import { Cartera } from '../../types/finance.types';

interface CarteraCardProps {
    cartera: Cartera;
    confirmDeleteId: number | null;
    onEdit: (cartera: Cartera) => void;
    onRequestDelete: (id: number) => void;
    onCancelDelete: () => void;
    onConfirmDelete: (id: number) => void;
}

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v);

const CarteraCard = (props: CarteraCardProps) => {
    const { cartera, confirmDeleteId, onEdit, onRequestDelete, onCancelDelete, onConfirmDelete } = props;



    const confirmando = confirmDeleteId === cartera.id;
    const numCuentas = cartera.cuentas.filter(c => c.tipo === 'cuenta_corriente').length;
    const numInversiones = cartera.cuentas.filter(c => c.tipo === 'inversion').length;

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
                    <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/15
                        flex items-center justify-center text-green-400 flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{cartera.nombre}</h3>
                        {cartera.descripcion && (
                            <p className="text-xs text-slate-500 truncate mt-0.5">{cartera.descripcion}</p>
                        )}
                    </div>
                </div>

                {/* Acciones — editar / eliminar */}
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
                            onClick={() => onConfirmDelete(cartera.id)}
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
                            onClick={() => {

                                onEdit(cartera);
                            }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center
                                text-slate-600 hover:text-green-400 hover:bg-green-500/10
                                transition-all duration-200"
                            title="Editar cartera"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onRequestDelete(cartera.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center
                                text-slate-600 hover:text-red-400 hover:bg-red-500/10
                                transition-all duration-200"
                            title="Eliminar cartera"
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

            {/* Saldo total */}
            <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Saldo total</span>
                <span className="text-xl font-bold text-white tracking-tight">
                    {formatCurrency(cartera.saldoTotal)}
                </span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                    bg-blue-500/10 text-blue-400 border border-blue-500/15">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    {numCuentas} {numCuentas === 1 ? 'cuenta' : 'cuentas'}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                    bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                    </svg>
                    {numInversiones} {numInversiones === 1 ? 'inversión' : 'inversiones'}
                </span>
                {cartera.cuentas.length === 0 && (
                    <span className="text-xs text-slate-600 italic">Sin cuentas asignadas</span>
                )}
            </div>
        </div>
    );
};

export default CarteraCard;
