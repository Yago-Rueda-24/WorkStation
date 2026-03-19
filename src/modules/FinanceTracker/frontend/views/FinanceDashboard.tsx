import { useEffect, useState } from 'react';

const api = (window as any).api['finance-tracker'];

// --- Types ---

interface CuentaResumen {
    id: number;
    nombre: string;
    saldo: number;
    banco: string | null;
    moneda: string;
}

interface InversionResumen {
    id: number;
    nombre: string;
    saldo: number;
    valorTotal: number;
    valorInicial: number;
    tipo: string;
    rentabilidad: number;
    moneda: string;
}

interface ResumenInversiones {
    totalValor: number;
    totalInvertido: number;
    rentabilidadGlobal: number;
}

// --- Sub-components ---

const SummaryCard = ({
    label,
    value,
    sub,
    accent,
    icon,
    loading,
}: {
    label: string;
    value: string;
    sub?: string;
    accent: string;
    icon: React.ReactNode;
    loading: boolean;
}) => (
    <div className={`group bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6
        flex flex-col gap-4 transition-all duration-300
        hover:-translate-y-1 hover:border-white/20 hover:shadow-xl`}>
        <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
                {icon}
            </div>
        </div>
        {loading ? (
            <div className="h-8 w-2/3 bg-white/5 rounded-lg animate-pulse" />
        ) : (
            <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
                {sub && <span className="text-xs text-slate-500">{sub}</span>}
            </div>
        )}
    </div>
);

const RentabilidadBadge = ({ value }: { value: number }) => {
    const positive = value >= 0;
    return (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border
            ${positive
                ? 'text-green-400 bg-green-500/10 border-green-500/20'
                : 'text-red-400 bg-red-500/10 border-red-500/20'
            }`}>
            {positive ? '+' : ''}{value.toFixed(2)}%
        </span>
    );
};

const EmptyState = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center justify-center py-8 text-slate-600 gap-2">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="text-sm">{label}</span>
    </div>
);

// --- Main Component ---

const FinanceDashboard = () => {
    const [cuentas, setCuentas] = useState<CuentaResumen[]>([]);
    const [inversiones, setInversiones] = useState<InversionResumen[]>([]);
    const [totalSaldoCuentas, setTotalSaldoCuentas] = useState(0);
    const [resumenInversiones, setResumenInversiones] = useState<ResumenInversiones | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [cuentasData, inversionesData, totalSaldo, resumen] = await Promise.all([
                    api.handleCuentaGetAll(),
                    api.handleInversionGetAll(),
                    api.handleCuentaGetTotalSaldo(),
                    api.handleInversionGetResumen(),
                ]);
                setCuentas(cuentasData);
                setInversiones(inversionesData);
                setTotalSaldoCuentas(totalSaldo);
                setResumenInversiones(resumen);
            } catch (err) {
                console.error('[FinanceDashboard] Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (value: number, moneda = 'EUR') =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: moneda }).format(value);

    const totalPatrimonio = totalSaldoCuentas + (resumenInversiones?.totalValor ?? 0);

    return (
        <div className="flex flex-col gap-8 p-6 pb-10 overflow-y-auto">

            {/* Header */}
            <header>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                    Resumen financiero
                </h1>
                <p className="text-slate-400 text-sm mt-1">Vista general de tu patrimonio</p>
            </header>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <SummaryCard
                    label="Patrimonio total"
                    value={formatCurrency(totalPatrimonio)}
                    sub="Cuentas + inversiones"
                    accent="bg-green-500/15 text-green-400"
                    loading={loading}
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    }
                />
                <SummaryCard
                    label="Saldo en cuentas"
                    value={formatCurrency(totalSaldoCuentas)}
                    sub={`${cuentas.length} cuenta${cuentas.length !== 1 ? 's' : ''}`}
                    accent="bg-blue-500/15 text-blue-400"
                    loading={loading}
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                    }
                />
                <SummaryCard
                    label="Valor inversiones"
                    value={formatCurrency(resumenInversiones?.totalValor ?? 0)}
                    sub={`${inversiones.length} posición${inversiones.length !== 1 ? 'es' : ''}`}
                    accent="bg-emerald-500/15 text-emerald-400"
                    loading={loading}
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                            <polyline points="16 7 22 7 22 13" />
                        </svg>
                    }
                />
                <SummaryCard
                    label="Rentabilidad global"
                    value={`${resumenInversiones && resumenInversiones.rentabilidadGlobal >= 0 ? '+' : ''}${(resumenInversiones?.rentabilidadGlobal ?? 0).toFixed(2)}%`}
                    sub={resumenInversiones
                        ? `${formatCurrency(resumenInversiones.totalValor - resumenInversiones.totalInvertido)} vs inversión`
                        : undefined
                    }
                    accent={
                        (resumenInversiones?.rentabilidadGlobal ?? 0) >= 0
                            ? 'bg-green-500/15 text-green-400'
                            : 'bg-red-500/15 text-red-400'
                    }
                    loading={loading}
                    icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20V10" />
                            <path d="M18 20V4" />
                            <path d="M6 20v-4" />
                        </svg>
                    }
                />
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Cuentas corrientes */}
                <section className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                    <line x1="2" y1="10" x2="22" y2="10" />
                                </svg>
                            </div>
                            <h2 className="text-sm font-bold text-white/80">Cuentas corrientes</h2>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{cuentas.length} registros</span>
                    </div>

                    <div className="divide-y divide-white/5">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                                    <div className="h-4 w-1/3 bg-white/5 rounded animate-pulse" />
                                    <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
                                </div>
                            ))
                        ) : cuentas.length === 0 ? (
                            <EmptyState label="No hay cuentas registradas" />
                        ) : (
                            cuentas.map((cuenta) => (
                                <div key={cuenta.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors group">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium text-white/85 group-hover:text-white transition-colors">
                                            {cuenta.nombre}
                                        </span>
                                        {cuenta.banco && (
                                            <span className="text-xs text-slate-500">{cuenta.banco}</span>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-green-400 tabular-nums">
                                        {formatCurrency(cuenta.saldo, cuenta.moneda)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Inversiones */}
                <section className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                            </div>
                            <h2 className="text-sm font-bold text-white/80">Inversiones</h2>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{inversiones.length} posiciones</span>
                    </div>

                    <div className="divide-y divide-white/5">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                                    <div className="h-4 w-1/3 bg-white/5 rounded animate-pulse" />
                                    <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
                                </div>
                            ))
                        ) : inversiones.length === 0 ? (
                            <EmptyState label="No hay inversiones registradas" />
                        ) : (
                            inversiones.map((inv) => (
                                <div key={inv.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors group">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium text-white/85 group-hover:text-white transition-colors">
                                            {inv.nombre}
                                        </span>
                                        <span className="text-xs text-slate-500 capitalize">{inv.tipo}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-sm font-bold text-emerald-400 tabular-nums">
                                            {formatCurrency(inv.valorTotal, inv.moneda)}
                                        </span>
                                        <RentabilidadBadge value={inv.rentabilidad} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FinanceDashboard;
