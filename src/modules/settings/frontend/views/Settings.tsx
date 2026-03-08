import { useState } from 'react'
import { useNavigate } from 'react-router'
import { sileo } from 'sileo'

function Settings() {
    const navigate = useNavigate()
    const [checking, setChecking] = useState(false)

    const handleCheckForUpdates = async () => {
        if (checking) return
        setChecking(true)

        try {
            // Await the promise returned by the main process
            const result = await (window as any).api.updater.checkForUpdates()
            const isAvailable = result && result.updateInfo

            if (isAvailable && result.updateInfo.version !== '0.0.0') { // 0.0.0 check is just fallback, electron-updater handles the actual diff
                sileo.success({
                    title: 'Actualización disponible',
                    description: `La versión ${result.updateInfo.version} está lista para descargar. Al pulsar 'Descargar' se bajará en segundo plano.`,
                    button: {
                        title: 'Descargar',
                        onClick: () => (window as any).api.updater.downloadUpdate(),
                    },
                    styles: {
                        description: "text-black/75!",
                    }
                })
            } else {
                sileo.info({
                    title: 'Aplicación actualizada',
                    description: 'Estás utilizando la última versión de WorkStation.',
                    duration: 4000,
                    styles: {
                        description: "text-black/75!",
                    }
                })
            }
        } catch {
            sileo.error({
                title: 'Error de actualización',
                description: 'No se ha podido comprobar si hay actualizaciones. Inténtalo más tarde.',
                duration: 5000,
                styles: {
                    description: "text-black/75!",
                }
            })
        } finally {
            setChecking(false)
        }
    }

    return (
        <main className="flex flex-col w-full px-6">
            <header className="mb-6 text-left w-full">
                <h1 className="text-4xl font-extrabold m-0 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent tracking-tight">Settings</h1>
                <div className="flex items-center gap-4 mt-2">
                    <p className="text-[#94a3b8] text-base m-0">Configure your workstation</p>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/20 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        Dashboard
                    </button>
                </div>
            </header>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white">General Preferences</h3>
                    <p className="text-[#94a3b8] text-sm">Update your application settings and display options.</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Dark Mode</span>
                        <span className="text-xs text-[#94a3b8]">Enable or disable the dark theme</span>
                    </div>
                    <div className="w-12 h-6 bg-teal-500 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 opacity-50">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Refresh Rate</span>
                        <span className="text-xs text-[#94a3b8]">Interval for system data updates (Currently 1s)</span>
                    </div>
                    <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">1000ms</span>
                </div>
            </div>

            {/* --- Updates Section --- */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col gap-6 mt-6">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white">Updates</h3>
                    <p className="text-[#94a3b8] text-sm">Check if a new version of WorkStation is available.</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Check for Updates</span>
                        <span className="text-xs text-[#94a3b8]">Search for new versions on GitHub</span>
                    </div>
                    <button
                        id="check-updates-btn"
                        onClick={handleCheckForUpdates}
                        disabled={checking}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {checking ? 'Checking...' : 'Check Now'}
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Settings
