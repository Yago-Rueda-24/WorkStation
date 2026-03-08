import { useNavigate } from 'react-router'
import { frontendModules } from '../../registry/modules'

function Dashboard() {
    const navigate = useNavigate()

    return (
        <main className="flex flex-col w-full px-6">
            <header className="mb-10 text-left">
                <h1 className="text-4xl font-extrabold m-0 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
                    WorkStation
                </h1>
                <p className="text-[#94a3b8] text-base mt-2">Select a module to get started</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {frontendModules.map((mod) => (
                    <button
                        key={mod.id}
                        onClick={() => navigate(mod.route)}
                        className={`
                            group text-left bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-7
                            flex flex-col gap-5 transition-all duration-300 cursor-pointer
                            hover:-translate-y-1.5 hover:border-white/20 hover:shadow-2xl ${mod.shadow}
                            focus:outline-none focus:ring-2 focus:ring-teal-500/50
                        `}
                    >
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 ${mod.color} transition-transform duration-300 group-hover:scale-110`}>
                            {mod.icon}
                        </div>

                        {/* Text */}
                        <div className="flex flex-col gap-2">
                            <h2 className={`text-xl font-bold m-0 ${mod.color}`}>{mod.title}</h2>
                            <p className="text-sm text-[#94a3b8] m-0 leading-relaxed">{mod.description}</p>
                        </div>

                        {/* Arrow */}
                        <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${mod.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
                            <span>Open</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </div>
                    </button>
                ))}
            </div>
        </main>
    )
}

export default Dashboard
