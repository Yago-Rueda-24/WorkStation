import { useEffect, useRef, useState } from 'react';
import { TipoInversion, InversionFormData, CarteraOption } from '../../types/finance.types';

// ─── Constantes ───────────────────────────────────────────────────────────────

const TIPOS: { value: TipoInversion; label: string; icon: React.ReactNode }[] = [
    {
        value: 'acciones',
        label: 'Acciones',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
            </svg>
        ),
    },
    {
        value: 'fondos',
        label: 'Fondos',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
        ),
    },
    {
        value: 'cripto',
        label: 'Cripto',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
    },
    {
        value: 'deposito',
        label: 'Depósito',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="22" x2="21" y2="22" /><rect x="6" y="2" width="12" height="20" rx="1" /><path d="M10 7h4M10 12h4" />
            </svg>
        ),
    },
    {
        value: 'otro',
        label: 'Otro',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
        ),
    },
];

const MONEDAS = [
    { code: 'EUR', label: 'EUR — Euro' },
    { code: 'USD', label: 'USD — Dólar estadounidense' },
    { code: 'GBP', label: 'GBP — Libra esterlina' },
    { code: 'CHF', label: 'CHF — Franco suizo' },
    { code: 'JPY', label: 'JPY — Yen japonés' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface InversionFormModalProps {
    mode: 'create' | 'edit';
    initialData?: InversionFormData;
    carteras: CarteraOption[];
    onClose: () => void;
    onSave: (data: InversionFormData) => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// De ISO string a "YYYY-MM-DD" para input[type=date]
const isoToDateInput = (iso: string | null): string => {
    if (!iso) return '';
    return iso.substring(0, 10);
};

const calcRentabilidad = (saldoStr: string, valorInicialStr: string): number | null => {
    const s = parseFloat(saldoStr);
    const v = parseFloat(valorInicialStr);
    if (!isFinite(s) || !isFinite(v) || v === 0) return null;
    return ((s - v) / v) * 100;
};

// ─── Component ────────────────────────────────────────────────────────────────

const InversionFormModal = ({
    mode,
    initialData,
    carteras,
    onClose,
    onSave,
}: InversionFormModalProps) => {
    const isEdit = mode === 'edit';

    const [nombre,       setNombre]       = useState(initialData?.nombre ?? '');
    const [tipo,         setTipo]         = useState<TipoInversion>(initialData?.tipo ?? 'acciones');
    const [moneda,       setMoneda]       = useState(initialData?.moneda ?? 'EUR');
    const [valorInicial, setValorInicial] = useState(String(initialData?.valorInicial ?? 0));
    const [saldo,        setSaldo]        = useState(String(initialData?.saldo ?? 0));
    const [fechaInicio,  setFechaInicio]  = useState(isoToDateInput(initialData?.fechaInicio ?? null));
    const [carteraId,    setCarteraId]    = useState<number | null>(initialData?.carteraId ?? null);
    const [saving,       setSaving]       = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => { inputRef.current?.focus(); }, []);

    // Rentabilidad calculada en vivo
    const rentabilidadPreview = calcRentabilidad(saldo, valorInicial);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        setSaving(true);
        try {
            await onSave({
                nombre:       nombre.trim(),
                saldo:        parseFloat(saldo) || 0,
                valorInicial: parseFloat(valorInicial) || 0,
                tipo,
                fechaInicio:  fechaInicio ? fechaInicio : null,
                moneda,
                carteraId,
            });
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-violet-400">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                            </svg>
                        </div>
                        <h2 className="text-base font-bold text-white">
                            {isEdit ? 'Editar inversión' : 'Nueva inversión'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Nombre */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Nombre <span className="text-red-400">*</span>
                        </label>
                        <input
                            ref={inputRef}
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Ej. Cartera S&P 500"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3
                                text-white placeholder-slate-600 text-sm
                                focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30
                                transition-all"
                        />
                    </div>

                    {/* Tipo selector — botones visuales */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Tipo
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                            {TIPOS.map(t => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setTipo(t.value)}
                                    className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border text-xs font-semibold
                                        transition-all duration-150
                                        ${tipo === t.value
                                            ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                                            : 'bg-slate-800 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
                                        }`}
                                >
                                    <span className={tipo === t.value ? 'text-violet-400' : 'text-slate-500'}>
                                        {t.icon}
                                    </span>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Capital invertido + Valor actual — con rentabilidad en vivo */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Importes
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Capital invertido */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-600 pl-1">Capital invertido</span>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium pointer-events-none">
                                        {moneda}
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={valorInicial}
                                        onChange={e => setValorInicial(e.target.value)}
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl pl-10 pr-3 py-3
                                            text-white text-sm
                                            focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30
                                            transition-all"
                                    />
                                </div>
                            </div>

                            {/* Valor actual */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-600 pl-1">Valor de mercado</span>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium pointer-events-none">
                                        {moneda}
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={saldo}
                                        onChange={e => setSaldo(e.target.value)}
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl pl-10 pr-3 py-3
                                            text-white text-sm
                                            focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30
                                            transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rentabilidad en vivo */}
                        {rentabilidadPreview !== null && (
                            <div className={`flex items-center gap-1.5 mt-1 pl-1 text-xs font-semibold
                                ${rentabilidadPreview >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    {rentabilidadPreview >= 0
                                        ? <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>
                                        : <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>
                                    }
                                </svg>
                                Rentabilidad: {rentabilidadPreview >= 0 ? '+' : ''}{rentabilidadPreview.toFixed(2)}%
                            </div>
                        )}
                    </div>

                    {/* Fecha de inicio + Moneda */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Fecha de inicio
                            </label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={e => setFechaInicio(e.target.value)}
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3
                                    text-white text-sm
                                    focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30
                                    transition-all [color-scheme:dark]"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Moneda
                            </label>
                            <select
                                value={moneda}
                                onChange={e => setMoneda(e.target.value)}
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3
                                    text-white text-sm appearance-none cursor-pointer
                                    focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30
                                    transition-all"
                            >
                                {MONEDAS.map(m => (
                                    <option key={m.code} value={m.code}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Cartera */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Cartera
                        </label>
                        <select
                            value={carteraId ?? ''}
                            onChange={e => setCarteraId(e.target.value === '' ? null : Number(e.target.value))}
                            disabled={carteras.length === 0}
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3
                                text-sm appearance-none cursor-pointer transition-all
                                focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30
                                disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ color: carteraId === null ? '#475569' : '#fff' }}
                        >
                            <option value="">
                                {carteras.length === 0 ? 'No hay carteras creadas' : 'Sin cartera'}
                            </option>
                            {carteras.map(c => (
                                <option key={c.id} value={c.id} style={{ color: '#fff' }}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                        {carteras.length === 0 && (
                            <p className="text-xs text-slate-600 mt-0.5 pl-1">
                                Crea una cartera primero para poder asociar inversiones.
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400
                                hover:text-white hover:bg-white/5 border border-transparent
                                hover:border-white/10 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!nombre.trim() || saving}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                                bg-gradient-to-r from-violet-500 to-purple-600
                                hover:from-violet-400 hover:to-purple-500
                                text-white shadow-lg shadow-violet-500/20
                                transition-all duration-200 hover:-translate-y-0.5
                                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {saving ? (
                                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                            ) : isEdit ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            )}
                            {isEdit ? 'Guardar cambios' : 'Añadir inversión'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InversionFormModal;
