import { useState, FormEvent, useEffect, useRef } from 'react';
import { TransactionFormData } from '../../types/finance.types';

interface TransactionFormModalProps {
    cuentaCorrienteId: number;
    onClose: () => void;
    onSave: (data: TransactionFormData) => Promise<void>;
}

const TransactionFormModal = ({ cuentaCorrienteId, onClose, onSave }: TransactionFormModalProps) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [valorStr, setValorStr] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    // Escape listener y Focus
    useEffect(() => {
        inputRef.current?.focus();
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        
        let val = parseFloat(valorStr.replace(',', '.'));
        if (isNaN(val)) {
            setError('El valor introducido no es válido');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave({
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                valor: val,
                cuentaCorrienteId
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al guardar la transacción');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative bg-[#1e293b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
                    <h2 className="text-lg font-bold text-white">Nueva transacción</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-300">Concepto / Nombre</label>
                        <input
                            ref={inputRef}
                            type="text"
                            required
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            placeholder="Ej. Nómina, Compra súper, etc."
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-300">Descripción (opcional)</label>
                        <textarea
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none h-20"
                            placeholder="Detalles adicionales..."
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-300">Valor</label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="decimal"
                                required
                                value={valorStr}
                                onChange={e => setValorStr(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                placeholder="0.00"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                €
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Usa valores positivos para ingresos y negativos (-) para gastos.</p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-white/10 flex justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !nombre.trim() || !valorStr}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionFormModal;
