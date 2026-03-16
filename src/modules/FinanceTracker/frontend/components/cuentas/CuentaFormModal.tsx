import { useEffect, useRef, useState } from 'react';
import { CarteraOption, CuentaFormData } from '../../types/finance.types';

const MONEDAS = [
    { code: 'EUR', label: 'EUR — Euro' },
    { code: 'USD', label: 'USD — Dólar estadounidense' },
    { code: 'GBP', label: 'GBP — Libra esterlina' },
    { code: 'CHF', label: 'CHF — Franco suizo' },
    { code: 'JPY', label: 'JPY — Yen japonés' },
];

interface CuentaFormModalProps {
    mode: 'create' | 'edit';
    initialData?: CuentaFormData;
    carteras: CarteraOption[];
    onClose: () => void;
    onSave: (data: CuentaFormData) => Promise<void>;
}

const formatIban = (raw: string) =>
    raw.toUpperCase().replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();

const CuentaFormModal = ({ mode, initialData, carteras, onClose, onSave }: CuentaFormModalProps) => {
    const isEdit = mode === 'edit';

    const [nombre,    setNombre]    = useState(initialData?.nombre ?? '');
    const [banco,     setBanco]     = useState(initialData?.banco ?? '');
    const [iban,      setIban]      = useState(
        initialData?.iban ? formatIban(initialData.iban) : ''
    );
    const [saldo,     setSaldo]     = useState(String(initialData?.saldo ?? 0));
    const [moneda,    setMoneda]    = useState(initialData?.moneda ?? 'EUR');
    const [carteraId, setCarteraId] = useState<number | null>(initialData?.carteraId ?? null);
    const [saving,    setSaving]    = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const clean = e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 34);
        setIban(formatIban(clean));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        setSaving(true);
        try {
            await onSave({
                nombre:    nombre.trim(),
                saldo:     parseFloat(saldo) || 0,
                iban:      iban.replace(/\s/g, '') || null,
                banco:     banco.trim() || null,
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
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                        </div>
                        <h2 className="text-base font-bold text-white">
                            {isEdit ? 'Editar cuenta' : 'Nueva cuenta corriente'}
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
                            placeholder="Ej. Cuenta nómina BBVA"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3
                                text-white placeholder-slate-600 text-sm
                                focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30
                                transition-all"
                        />
                    </div>

                    {/* Banco + Moneda */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Banco
                            </label>
                            <input
                                value={banco}
                                onChange={e => setBanco(e.target.value)}
                                placeholder="Ej. BBVA"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3
                                    text-white placeholder-slate-600 text-sm
                                    focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30
                                    transition-all"
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
                                    text-white text-sm
                                    focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30
                                    transition-all appearance-none cursor-pointer"
                            >
                                {MONEDAS.map(m => (
                                    <option key={m.code} value={m.code}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* IBAN */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            IBAN
                        </label>
                        <input
                            value={iban}
                            onChange={handleIbanChange}
                            placeholder="Ej. ES91 2100 0418 4502 0005 1332"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3
                                text-white placeholder-slate-600 text-sm font-mono tracking-wider
                                focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30
                                transition-all"
                        />
                    </div>

                    {/* Saldo */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {isEdit ? 'Saldo actual' : 'Saldo inicial'}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium pointer-events-none">
                                {moneda}
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={saldo}
                                onChange={e => setSaldo(e.target.value)}
                                className="w-full bg-slate-800 border border-white/10 rounded-xl pl-12 pr-4 py-3
                                    text-white text-sm
                                    focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30
                                    transition-all"
                            />
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
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3
                                text-sm appearance-none cursor-pointer transition-all
                                focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30
                                disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ color: carteraId === null ? '#475569' : '#fff' }}
                            disabled={carteras.length === 0}
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
                                Crea una cartera primero para poder asociar cuentas.
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
                                bg-gradient-to-r from-blue-500 to-indigo-600
                                hover:from-blue-400 hover:to-indigo-500
                                text-white shadow-lg shadow-blue-500/20
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
                            {isEdit ? 'Guardar cambios' : 'Añadir cuenta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CuentaFormModal;
