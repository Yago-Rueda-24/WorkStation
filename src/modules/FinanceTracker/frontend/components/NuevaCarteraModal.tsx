import { useEffect, useRef, useState } from 'react';

interface NuevaCarteraModalProps {
    onClose: () => void;
    onCreate: (nombre: string, descripcion: string) => Promise<void>;
}

const NuevaCarteraModal = ({ onClose, onCreate }: NuevaCarteraModalProps) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        setSaving(true);
        try {
            await onCreate(nombre.trim(), descripcion.trim());
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
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center text-green-400">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                        </div>
                        <h2 className="text-base font-bold text-white">Nueva cartera</h2>
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
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Nombre <span className="text-red-400">*</span>
                        </label>
                        <input
                            ref={inputRef}
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Ej. Patrimonio personal"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3
                                text-white placeholder-slate-600 text-sm
                                focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30
                                transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            placeholder="Descripción opcional..."
                            rows={3}
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3
                                text-white placeholder-slate-600 text-sm resize-none
                                focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30
                                transition-all"
                        />
                    </div>

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
                                bg-gradient-to-r from-green-500 to-emerald-600
                                hover:from-green-400 hover:to-emerald-500
                                text-white shadow-lg shadow-green-500/20
                                transition-all duration-200 hover:-translate-y-0.5
                                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {saving ? (
                                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            )}
                            Crear cartera
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NuevaCarteraModal;
