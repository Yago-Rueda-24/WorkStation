import { useCallback, useEffect, useState } from 'react';
import { Inversion, InversionFormData, CarteraOption } from '../types/finance.types';
import InversionCard from '../components/inversiones/InversionCard';
import InversionFormModal from '../components/inversiones/InversionFormModal';

const api = (window as any).api['finance-tracker'];

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface EditingInversion {
    id: number;
    initialData: InversionFormData;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ onNew }: { onNew: () => void }) => (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-600">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
            </svg>
        </div>
        <div className="text-center">
            <p className="text-sm font-medium text-slate-500">No hay inversiones registradas</p>
            <p className="text-xs text-slate-600 mt-1">Añade tu primera posición de inversión</p>
        </div>
        <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                bg-violet-500/10 text-violet-400 border border-violet-500/20
                hover:bg-violet-500/15 hover:border-violet-500/30
                transition-all duration-200"
        >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva inversión
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
                        <div className="h-3 w-1/4 bg-white/5 rounded-full animate-pulse" />
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <div className="h-7 w-2/5 bg-white/5 rounded animate-pulse" />
                    <div className="h-7 w-16 bg-white/5 rounded-xl animate-pulse" />
                </div>
                <div className="h-12 bg-white/3 rounded-xl animate-pulse" />
                <div className="flex gap-2">
                    <div className="h-6 w-12 bg-white/5 rounded-full animate-pulse" />
                    <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse" />
                </div>
            </div>
        ))}
    </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({
    label,
    value,
    sub,
    accent,
}: {
    label: string;
    value: string;
    sub?: string;
    accent?: 'green' | 'red' | 'neutral';
}) => {
    const valueClass =
        accent === 'green' ? 'text-emerald-400' :
            accent === 'red' ? 'text-red-400' :
                'text-white';

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
            <span className={`text-xl font-bold tracking-tight ${valueClass}`}>{value}</span>
            {sub && <span className="text-xs text-slate-600">{sub}</span>}
        </div>
    );
};

// ─── Main View ────────────────────────────────────────────────────────────────

const InversionesView = () => {
    const [inversiones, setInversiones] = useState<Inversion[]>([]);
    const [carteras, setCarteras] = useState<CarteraOption[]>([]);
    const [inversionCarteraMap, setInversionCarteraMap] = useState<Map<number, { id: number; nombre: string }>>(new Map());
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingInversion, setEditingInversion] = useState<EditingInversion | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────

    const fetchData = useCallback(async () => {
        try {
            const [inversionesData, carterasData] = await Promise.all([
                api.handleInversionGetAll(),
                api.handleCarteraGetAll(),
            ]);

            setInversiones(inversionesData);
            setCarteras(carterasData.map((c: any) => ({ id: c.id, nombre: c.nombre })));

            // Construir mapa: inversionId → { id: carteraId, nombre }
            const map = new Map<number, { id: number; nombre: string }>();
            for (const cartera of carterasData) {
                for (const miembro of (cartera.cuentas ?? [])) {
                    if (miembro.tipo === 'inversion') {
                        map.set(miembro.id, { id: cartera.id, nombre: cartera.nombre });
                    }
                }
            }
            setInversionCarteraMap(map);
        } catch (err) {
            console.error('[InversionesView] Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Relación cartera helpers ──────────────────────────────────────────────

    const syncCarteraRelation = async (
        inversionId: number,
        newCarteraId: number | null,
        oldCarteraId: number | null,
    ) => {
        if (oldCarteraId === newCarteraId) return;
        if (oldCarteraId !== null) {
            await api.handleCarteraRemoveInversion({ carteraId: oldCarteraId, inversionId });
        }
        if (newCarteraId !== null) {
            await api.handleCarteraAddInversion({ carteraId: newCarteraId, inversionId });
        }
    };

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleCreate = async (data: InversionFormData) => {
        const { carteraId, ...invData } = data;
        const newInversion = await api.handleInversionCreate(invData);
        if (carteraId !== null) {
            await api.handleCarteraAddInversion({ carteraId, inversionId: newInversion.id });
        }
        await fetchData();
    };

    const handleUpdate = async (data: InversionFormData) => {
        if (!editingInversion) return;
        const { carteraId, ...invData } = data;
        await api.handleInversionUpdate({ id: editingInversion.id, ...invData });
        const oldCarteraId = inversionCarteraMap.get(editingInversion.id)?.id ?? null;
        await syncCarteraRelation(editingInversion.id, carteraId, oldCarteraId);
        await fetchData();
    };

    const handleOpenEdit = (inversion: Inversion) => {
        const carteraInfo = inversionCarteraMap.get(inversion.id) ?? null;
        setEditingInversion({
            id: inversion.id,
            initialData: {
                nombre: inversion.nombre,
                saldo: inversion.saldo,
                valorInicial: inversion.valorInicial,
                tipo: inversion.tipo,
                efectivoDisponible: inversion.efectivoDisponible,
                fechaInicio: inversion.fechaInicio,
                moneda: inversion.moneda,
                carteraId: carteraInfo?.id ?? null,
            },
        });
    };

    const handleDelete = async (id: number) => {
        try {
            const oldCarteraId = inversionCarteraMap.get(id)?.id ?? null;
            if (oldCarteraId !== null) {
                await api.handleCarteraRemoveInversion({ carteraId: oldCarteraId, inversionId: id });
            }
            await api.handleInversionDelete({ id });
            setInversiones(prev => prev.filter(i => i.id !== id));
            setInversionCarteraMap(prev => { const m = new Map(prev); m.delete(id); return m; });
        } catch (err) {
            console.error('[InversionesView] Error deleting inversión:', err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    // ── Computed ──────────────────────────────────────────────────────────────

    const totalValor = inversiones.reduce((acc, i) => acc + i.saldo, 0);
    const totalInvertido = inversiones.reduce((acc, i) => acc + i.valorInicial, 0);
    const rentGlobal = totalInvertido > 0
        ? ((totalValor - totalInvertido) / totalInvertido) * 100
        : 0;

    const formatEur = (v: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v);

    const rentAccent: 'green' | 'red' | 'neutral' =
        rentGlobal > 0 ? 'green' : rentGlobal < 0 ? 'red' : 'neutral';

    return (
        <div className="flex flex-col gap-6 p-6 pb-10">

            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
                        Inversiones
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Sigue el rendimiento de tu cartera de inversión
                    </p>
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                        bg-gradient-to-r from-violet-500 to-purple-600
                        hover:from-violet-400 hover:to-purple-500
                        text-white shadow-lg shadow-violet-500/20
                        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/30"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva inversión
                </button>
            </header>

            {/* Stat cards */}
            {!loading && inversiones.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    <StatCard
                        label="Valor total"
                        value={formatEur(totalValor)}
                        sub={`${inversiones.length} posición${inversiones.length !== 1 ? 'es' : ''}`}
                    />
                    <StatCard
                        label="Capital invertido"
                        value={formatEur(totalInvertido)}
                        sub="suma de aportaciones"
                    />
                    <StatCard
                        label="Rentabilidad global"
                        value={`${rentGlobal >= 0 ? '+' : ''}${rentGlobal.toFixed(2)}%`}
                        sub={`${rentGlobal >= 0 ? '+' : ''}${formatEur(totalValor - totalInvertido)}`}
                        accent={rentAccent}
                    />
                </div>
            )}

            {/* Content */}
            {loading ? (
                <LoadingSkeleton />
            ) : inversiones.length === 0 ? (
                <EmptyState onNew={() => setShowCreateModal(true)} />
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {inversiones.map(inv => (
                        <InversionCard
                            key={inv.id}
                            inversion={inv}
                            carteraNombre={inversionCarteraMap.get(inv.id)?.nombre ?? null}
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
                <InversionFormModal
                    mode="create"
                    carteras={carteras}
                    onClose={() => setShowCreateModal(false)}
                    onSave={handleCreate}
                />
            )}

            {/* Modal: editar */}
            {editingInversion && (
                <InversionFormModal
                    mode="edit"
                    initialData={editingInversion.initialData}
                    carteras={carteras}
                    onClose={() => setEditingInversion(null)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
};

export default InversionesView;
