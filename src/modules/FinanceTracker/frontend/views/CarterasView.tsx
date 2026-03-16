import { useEffect, useState } from 'react';
import { Cartera } from '../components/cartera.types';
import CarteraCard from '../components/CarteraCard';
import NuevaCarteraModal from '../components/NuevaCarteraModal';

const api = (window as any).api['finance-tracker'];

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ onNew }: { onNew: () => void }) => (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-600">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
        </div>
        <div className="text-center">
            <p className="text-sm font-medium text-slate-500">No hay carteras todavía</p>
            <p className="text-xs text-slate-600 mt-1">Crea tu primera cartera para agrupar cuentas e inversiones</p>
        </div>
        <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                bg-green-500/10 text-green-400 border border-green-500/20
                hover:bg-green-500/15 hover:border-green-500/30
                transition-all duration-200"
        >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva cartera
        </button>
    </div>
);

// ─── Skeleton ────────────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-800/50 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/5 rounded-xl animate-pulse" />
                    <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
                        <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
                    </div>
                </div>
                <div className="h-6 w-1/3 bg-white/5 rounded animate-pulse" />
                <div className="flex gap-2">
                    <div className="h-5 w-20 bg-white/5 rounded-full animate-pulse" />
                    <div className="h-5 w-24 bg-white/5 rounded-full animate-pulse" />
                </div>
            </div>
        ))}
    </div>
);

// ─── Main View ────────────────────────────────────────────────────────────────

const CarterasView = () => {
    const [carteras, setCarteras] = useState<Cartera[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const fetchCarteras = async () => {
        try {
            const data = await api.handleCarteraGetAll();
            setCarteras(data);
        } catch (err) {
            console.error('[CarterasView] Error fetching carteras:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarteras();
    }, []);

    const handleCreate = async (nombre: string, descripcion: string) => {
        await api.handleCarteraCreate({ nombre, descripcion: descripcion || null });
        await fetchCarteras();
    };

    const handleDelete = async (id: number) => {
        try {
            await api.handleCarteraDelete({ id });
            setCarteras(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error('[CarterasView] Error deleting cartera:', err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 pb-10">

            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                        Carteras
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Agrupa cuentas e inversiones en grupos personalizados
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                        bg-gradient-to-r from-green-500 to-emerald-600
                        hover:from-green-400 hover:to-emerald-500
                        text-white shadow-lg shadow-green-500/20
                        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-green-500/30"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva cartera
                </button>
            </header>

            {/* Content */}
            {loading ? (
                <LoadingSkeleton />
            ) : carteras.length === 0 ? (
                <EmptyState onNew={() => setShowModal(true)} />
            ) : (
                <div
                    className="grid grid-cols-1 xl:grid-cols-2 gap-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setConfirmDeleteId(null);
                    }}
                >
                    {carteras.map(cartera => (
                        <CarteraCard
                            key={cartera.id}
                            cartera={cartera}
                            confirmDeleteId={confirmDeleteId}
                            onRequestDelete={setConfirmDeleteId}
                            onCancelDelete={() => setConfirmDeleteId(null)}
                            onConfirmDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <NuevaCarteraModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
};

export default CarterasView;
