import React, { useState, useEffect } from 'react';
import { sileo } from 'sileo';

interface TaskSettings {
    id: number;
    autoDeleteCompletedTasks: boolean;
    autoDeleteDaysPassed: number;
}

interface SettingsViewProps {
    settings: TaskSettings | null;
    onUpdateSettings: (data: Partial<TaskSettings>) => Promise<void>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings }) => {
    const [autoDelete, setAutoDelete] = useState(false);
    const [days, setDays] = useState(30);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setAutoDelete(settings.autoDeleteCompletedTasks);
            setDays(settings.autoDeleteDaysPassed);
        }
    }, [settings]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onUpdateSettings({
                autoDeleteCompletedTasks: autoDelete,
                autoDeleteDaysPassed: days
            });
            sileo.success({
                title: "Configuración guardada",
                description: "La configuración se ha guardado correctamente.",
                styles: {
                    description: "text-black"
                }
            });
        } catch (err) {
            sileo.error({
                title: "No se ha gurdado la configuración",
                description: "No se ha podido guardar la configuración, por favor intenta de nuevo.",
                styles: {
                    description: "text-black"
                }
            });
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-y-auto pr-2">
            <header className="mb-8 text-left shrink-0 mt-6">
                <h1 className="text-4xl font-extrabold m-0 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                    Settings
                </h1>
                <p className="text-[#94a3b8] text-base mt-2">
                    Configura el comportamiento automático del gestor de tareas.
                </p>
            </header>

            <div className="max-w-2xl w-full flex flex-col gap-6">
                {/* Auto Delete Section */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-200 hover:border-blue-500/20 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-[#f8fafc]">Limpieza Automática</h3>
                            <p className="text-sm text-[#94a3b8]">Borra tareas completadas automáticamente después de un tiempo.</p>
                        </div>
                        <button
                            onClick={() => setAutoDelete(!autoDelete)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 ${autoDelete ? 'bg-blue-600' : 'bg-slate-700'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoDelete ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>

                    <div className={`space-y-4 transition-all duration-300 ${autoDelete ? 'opacity-100 max-h-40' : 'opacity-40 pointer-events-none max-h-40'}`}>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="days" className="text-sm font-medium text-slate-300">
                                Días transcurridos antes del borrado
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    id="days"
                                    min="1"
                                    max="365"
                                    value={days}
                                    onChange={(e) => setDays(parseInt(e.target.value) || 0)}
                                    className="bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-24 transition-all"
                                />
                                <span className="text-sm text-slate-400 font-medium">días</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
                    <span className="text-blue-400 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </span>
                    <p className="text-sm text-blue-300 leading-relaxed m-0">
                        Esta configuración es global y afecta a todas tus tareas. Los cambios se guardarán de forma permanente en la base de datos.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`
                            flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-0.5
                            ${saving ? 'opacity-50 cursor-not-allowed translate-y-0 shadow-none' : ''}
                        `}
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
