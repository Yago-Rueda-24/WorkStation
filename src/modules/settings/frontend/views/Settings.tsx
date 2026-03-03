import { useState } from 'react'
import { sileo } from 'sileo'

function Settings() {
    const [checking, setChecking] = useState(false)

    const handleCheckForUpdates = async () => {
        if (checking) return
        setChecking(true)

        try {
            // Create a promise that resolves when the updater responds
            const result = await new Promise<{ available: boolean; version?: string }>((resolve, reject) => {
                const api = (window as any).api

                const timeout = setTimeout(() => {
                    offAvailable()
                    offNotAvailable()
                    offError()
                    reject(new Error('Timeout'))
                }, 15000)

                const offAvailable = api.updater.onUpdateAvailable((info: any) => {
                    clearTimeout(timeout)
                    offAvailable()
                    offNotAvailable()
                    offError()
                    resolve({ available: true, version: info.version })
                })

                const offNotAvailable = api.updater.onUpdateNotAvailable(() => {
                    clearTimeout(timeout)
                    offAvailable()
                    offNotAvailable()
                    offError()
                    resolve({ available: false })
                })

                const offError = api.updater.onError((message: string) => {
                    clearTimeout(timeout)
                    offAvailable()
                    offNotAvailable()
                    offError()
                    reject(new Error(message))
                })

                api.updater.checkForUpdates()
            })

            if (result.available) {
                sileo.success({
                    title: 'Update Available',
                    description: `Version ${result.version} is ready to download.`,
                    button: {
                        title: 'Download',
                        onClick: () => (window as any).api.updater.downloadUpdate(),
                    },
                })
            } else {
                sileo.info({
                    title: 'Up to Date',
                    description: 'You are running the latest version.',
                    position: 'top-center',
                    duration: 4000,
                })
            }
        } catch {
            sileo.error({
                title: 'Update Error',
                description: 'Could not check for updates. Try again later.',
                position: 'top-center',
                duration: 5000,
            })
        } finally {
            setChecking(false)
        }
    }

    return (
        <main className="flex flex-col w-full px-6">
            <header className="mb-6 text-left">
                <h1 className="text-4xl font-extrabold m-0 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent tracking-tight">Settings</h1>
                <p className="text-[#94a3b8] text-base mt-2">Configure your workstation</p>
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
