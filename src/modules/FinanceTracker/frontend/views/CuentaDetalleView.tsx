import { useCallback, useEffect, useState } from 'react';
import { CuentaCorriente, Transaction, TransactionFormData } from '../types/finance.types';
import TransactionFormModal from '../components/transacciones/TransactionFormModal';

const api = (window as any).api['finance-tracker'];

interface CuentaDetalleViewProps {
    cuenta: CuentaCorriente;
    onBack: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatEur = (v: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v);

const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(dateStr));
};

// ── Componente de tarjeta de transacción ──────────────────────────────────────

const TransactionCardItem = ({ trx, type, onDelete }: { trx: Transaction; type: 'ingreso' | 'gasto', onDelete: (id: number) => void }) => (
    <div className={`group p-4 rounded-xl border flex items-center justify-between gap-3 bg-slate-800/40 backdrop-blur-sm transition-all hover:bg-slate-800/60
        ${type === 'ingreso' ? 'border-emerald-500/10 hover:border-emerald-500/30' : 'border-red-500/10 hover:border-red-500/30'}
    `}>
        <div className="flex flex-col min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">{trx.nombre}</h4>
            {trx.descripcion && <p className="text-xs text-slate-400 mt-0.5 truncate">{trx.descripcion}</p>}
            <span className="text-[11px] text-slate-500 mt-1">{formatDate(trx.createdAt)}</span>
        </div>
        <div className="flex items-center gap-4">
            <div className={`text-base font-bold whitespace-nowrap ${type === 'ingreso' ? 'text-emerald-400' : 'text-red-400'}`}>
                {type === 'ingreso' ? '+' : ''}{formatEur(trx.valor)}
            </div>
            <button
                onClick={() => onDelete(trx.id)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Eliminar transacción"
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                </svg>
            </button>
        </div>
    </div>
);

// ── Vista principal detalles cuenta ───────────────────────────────────────────

const CuentaDetalleView = ({ cuenta, onBack }: CuentaDetalleViewProps) => {
    const [currentCuenta, setCurrentCuenta] = useState<CuentaCorriente>(cuenta);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.handleTransactionGetByCuenta({ cuentaCorrienteId: currentCuenta.id });
            setTransactions(data);
        } catch (err) {
            console.error('[CuentaDetalleView] Error fetching transacciones:', err);
        } finally {
            setLoading(false);
        }
    }, [currentCuenta.id]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleCreateTransaction = async (data: TransactionFormData) => {
        await api.handleTransactionCreate(data);
        await fetchTransactions();
        const updatedCuenta = await api.handleCuentaGetById(currentCuenta.id);
        if (updatedCuenta) setCurrentCuenta(updatedCuenta);
    };

    const handleDeleteTransaction = async (id: number) => {
        try {
            await api.handleTransactionDelete({ id });
            await fetchTransactions();
            const updatedCuenta = await api.handleCuentaGetById(currentCuenta.id);
            if (updatedCuenta) setCurrentCuenta(updatedCuenta);
            setTransactionToDelete(null);
        } catch (err) {
            console.error('[CuentaDetalleView] Error deleting transaction:', err);
        }
    };

    const ingresos = transactions.filter(t => t.valor >= 0);
    const gastos = transactions.filter(t => t.valor < 0);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Cabecera */}
            <div className="flex-shrink-0 p-6 pb-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold
                            text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        Volver a cuentas
                    </button>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                            bg-indigo-500 text-white shadow-lg shadow-indigo-500/20
                            hover:bg-indigo-400 transition-all hover:-translate-y-0.5"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nueva transacción
                    </button>
                </div>

                <div className="mt-2 p-5 rounded-2xl bg-slate-800/80 border border-white/10 shadow-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">{currentCuenta.nombre}</h2>
                            {currentCuenta.banco && (
                                <p className="text-slate-400 text-sm font-medium">{currentCuenta.banco}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Saldo Disponible</span>
                        <span className={`text-2xl font-black tracking-tight ${currentCuenta.saldo >= 0 ? 'text-white' : 'text-red-400'}`}>
                            {formatEur(currentCuenta.saldo)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Listas de transacciones */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        <p>No hay transacciones registradas en esta cuenta.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative items-start">
                        {/* Divisor centado lg (visual) */}
                        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2"></div>

                        {/* Columna Ingresos */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 mb-2 px-3 sticky top-0 bg-[#0f172a] py-2 z-10 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Ingresos</h3>
                                <span className="ml-auto text-sm font-medium text-slate-500">{ingresos.length}</span>
                            </div>

                            {ingresos.length === 0 ? (
                                <p className="text-center text-sm text-slate-600 py-8 italic border border-dashed border-white/5 rounded-xl">Sin ingresos registrados</p>
                            ) : (
                                ingresos.map(trx => <TransactionCardItem key={trx.id} trx={trx} type="ingreso" onDelete={setTransactionToDelete} />)
                            )}
                        </div>

                        {/* Columna Gastos */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 mb-2 px-3 sticky top-0 bg-[#0f172a] py-2 z-10 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Gastos</h3>
                                <span className="ml-auto text-sm font-medium text-slate-500">{gastos.length}</span>
                            </div>

                            {gastos.length === 0 ? (
                                <p className="text-center text-sm text-slate-600 py-8 italic border border-dashed border-white/5 rounded-xl">Sin gastos registrados</p>
                            ) : (
                                gastos.map(trx => <TransactionCardItem key={trx.id} trx={trx} type="gasto" onDelete={setTransactionToDelete} />)
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <TransactionFormModal
                    cuentaCorrienteId={cuenta.id}
                    onClose={() => setShowCreateModal(false)}
                    onSave={handleCreateTransaction}
                />
            )}

            {transactionToDelete && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onMouseDown={(e) => { if (e.target === e.currentTarget) setTransactionToDelete(null); }}
                >
                    <div className="bg-[#1e293b] rounded-2xl border border-white/10 shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white">¿Eliminar transacción?</h3>
                        <p className="text-sm text-slate-400">Esta acción no se puede deshacer y el saldo de la cuenta se actualizará.</p>
                        <div className="flex items-center gap-3 mt-4">
                            <button
                                onClick={() => setTransactionToDelete(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDeleteTransaction(transactionToDelete)}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CuentaDetalleView;
