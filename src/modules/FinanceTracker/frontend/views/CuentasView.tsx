import { useCallback, useEffect, useState } from 'react';
import { CuentaCorriente, CarteraOption, CuentaFormData } from '../types/finance.types';
import CuentaCard from '../components/cuentas/CuentaCard';
import CuentaFormModal from '../components/cuentas/CuentaFormModal';

const api = (window as any).api['finance-tracker'];

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface EditingCuenta {
    id: number;
    initialData: CuentaFormData;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ onNew }: { onNew: () => void }) => (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-600">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
        </div>
        <div className="text-center">
            <p className="text-sm font-medium text-slate-500">No hay cuentas registradas</p>
            <p className="text-xs text-slate-600 mt-1">Añade tu primera cuenta corriente o de ahorro</p>
        </div>
        <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                bg-blue-500/10 text-blue-400 border border-blue-500/20
                hover:bg-blue-500/15 hover:border-blue-500/30
                transition-all duration-200"
        >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva cuenta
        </button>
    </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-800/50 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/5 rounded-xl animate-pulse" />
                    <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
                        <div className="h-3 w-1/3 bg-white/5 rounded animate-pulse" />
                    </div>
                </div>
                <div className="h-7 w-2/5 bg-white/5 rounded animate-pulse" />
                <div className="h-5 w-20 bg-white/5 rounded-full animate-pulse" />
            </div>
        ))}
    </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-xl font-bold text-white tracking-tight">{value}</span>
        {sub && <span className="text-xs text-slate-600">{sub}</span>}
    </div>
);

// ─── Main View ────────────────────────────────────────────────────────────────

const CuentasView = () => {
    const [cuentas, setCuentas]             = useState<CuentaCorriente[]>([]);
    const [carteras, setCarteras]           = useState<CarteraOption[]>([]);
    // Map<cuentaId, { carteraId, carteraNombre }>
    const [cuentaCarteraMap, setCuentaCarteraMap] = useState<Map<number, { id: number; nombre: string }>>(new Map());
    const [loading, setLoading]             = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCuenta, setEditingCuenta]     = useState<EditingCuenta | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────

    const fetchData = useCallback(async () => {
        try {
            const [cuentasData, carterasData] = await Promise.all([
                api.handleCuentaGetAll(),
                api.handleCarteraGetAll(),
            ]);

            setCuentas(cuentasData);
            setCarteras(carterasData.map((c: any) => ({ id: c.id, nombre: c.nombre })));

            // Construir mapa: cuentaId → { id: carteraId, nombre: carteraNombre }
            const map = new Map<number, { id: number; nombre: string }>();
            for (const cartera of carterasData) {
                for (const miembro of (cartera.cuentas ?? [])) {
                    if (miembro.tipo === 'cuenta_corriente') {
                        map.set(miembro.id, { id: cartera.id, nombre: cartera.nombre });
                    }
                }
            }
            setCuentaCarteraMap(map);
        } catch (err) {
            console.error('[CuentasView] Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Relación cartera helpers ──────────────────────────────────────────────

    const syncCarteraRelation = async (
        cuentaId: number,
        newCarteraId: number | null,
        oldCarteraId: number | null,
    ) => {
        if (oldCarteraId === newCarteraId) return;
        if (oldCarteraId !== null) {
            await api.handleCarteraRemoveCuenta({ carteraId: oldCarteraId, cuentaId });
        }
        if (newCarteraId !== null) {
            await api.handleCarteraAddCuenta({ carteraId: newCarteraId, cuentaId });
        }
    };

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleCreate = async (data: CuentaFormData) => {
        const { carteraId, ...cuentaData } = data;
        const newCuenta = await api.handleCuentaCreate(cuentaData);
        if (carteraId !== null) {
            await api.handleCarteraAddCuenta({ carteraId, cuentaId: newCuenta.id });
        }
        await fetchData();
    };

    const handleUpdate = async (data: CuentaFormData) => {
        if (!editingCuenta) return;
        const { carteraId, ...cuentaData } = data;
        await api.handleCuentaUpdate({ id: editingCuenta.id, ...cuentaData });
        const oldCarteraId = cuentaCarteraMap.get(editingCuenta.id)?.id ?? null;
        await syncCarteraRelation(editingCuenta.id, carteraId, oldCarteraId);
        await fetchData();
    };

    const handleOpenEdit = (cuenta: CuentaCorriente) => {
        const carteraInfo = cuentaCarteraMap.get(cuenta.id) ?? null;
        setEditingCuenta({
            id: cuenta.id,
            initialData: {
                nombre:    cuenta.nombre,
                saldo:     cuenta.saldo,
                iban:      cuenta.iban,
                banco:     cuenta.banco,
                moneda:    cuenta.moneda,
                carteraId: carteraInfo?.id ?? null,
            },
        });
    };

    const handleDelete = async (id: number) => {
        try {
            // Desasociar de cartera antes de eliminar (evitar huérfanos)
            const oldCarteraId = cuentaCarteraMap.get(id)?.id ?? null;
            if (oldCarteraId !== null) {
                await api.handleCarteraRemoveCuenta({ carteraId: oldCarteraId, cuentaId: id });
            }
            await api.handleCuentaDelete({ id });
            setCuentas(prev => prev.filter(c => c.id !== id));
            setCuentaCarteraMap(prev => { const m = new Map(prev); m.delete(id); return m; });
        } catch (err) {
            console.error('[CuentasView] Error deleting cuenta:', err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    // ── Computed ──────────────────────────────────────────────────────────────

    const totalSaldo = cuentas.reduce((acc, c) => acc + c.saldo, 0);
    const formatEur  = (v: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v);

    return (
        <div className="flex flex-col gap-6 p-6 pb-10">

            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                        Cuentas corrientes
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Gestiona tus cuentas bancarias y saldos
                    </p>
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                        bg-gradient-to-r from-blue-500 to-indigo-600
                        hover:from-blue-400 hover:to-indigo-500
                        text-white shadow-lg shadow-blue-500/20
                        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/30"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva cuenta
                </button>
            </header>

            {/* Stat cards */}
            {!loading && cuentas.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                    <StatCard
                        label="Saldo total"
                        value={formatEur(totalSaldo)}
                        sub={`${cuentas.length} cuenta${cuentas.length !== 1 ? 's' : ''}`}
                    />
                    <StatCard
                        label="Saldo medio"
                        value={formatEur(totalSaldo / cuentas.length)}
                        sub="por cuenta"
                    />
                </div>
            )}

            {/* Content */}
            {loading ? (
                <LoadingSkeleton />
            ) : cuentas.length === 0 ? (
                <EmptyState onNew={() => setShowCreateModal(true)} />
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {cuentas.map(cuenta => (
                        <CuentaCard
                            key={cuenta.id}
                            cuenta={cuenta}
                            carteraNombre={cuentaCarteraMap.get(cuenta.id)?.nombre ?? null}
                            confirmDeleteId={confirmDeleteId}
                            onEdit={handleOpenEdit}
                            onRequestDelete={setConfirmDeleteId}
                            onCancelDelete={() => setConfirmDeleteId(null)}
                            onConfirmDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modal: crear */}
            {showCreateModal && (
                <CuentaFormModal
                    mode="create"
                    carteras={carteras}
                    onClose={() => setShowCreateModal(false)}
                    onSave={handleCreate}
                />
            )}

            {/* Modal: editar */}
            {editingCuenta && (
                <CuentaFormModal
                    mode="edit"
                    initialData={editingCuenta.initialData}
                    carteras={carteras}
                    onClose={() => setEditingCuenta(null)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
};

export default CuentasView;
