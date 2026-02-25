function Settings() {
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
        </main>
    )
}

export default Settings
