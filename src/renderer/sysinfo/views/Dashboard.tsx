import { useState, useEffect } from 'react'
import { SysInfoEntity } from '../../../main/sysinfo/domain/sysinfo.entity'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

function Dashboard() {
    const MAX_DATA_POINTS = 25
    const [sysInfo, setSysInfo] = useState<SysInfoEntity | null>(null)
    const [cpuLoad, setCpuLoad] = useState<number[]>([])
    const [memLoad, setMemLoad] = useState<number[]>([])
    const [diskLoad, setDiskLoad] = useState<number[]>([])
    const [gpuLoad, setGpuLoad] = useState<number[]>([])

    useEffect(() => {
        const processData = (data: any) => {
            const info = SysInfoEntity.fromPlain(data)
            setSysInfo(info)

            setCpuLoad(prev => [...prev, info.getCpuLoad()].slice(-MAX_DATA_POINTS))
            setMemLoad(prev => [...prev, info.getMemoryLoad()].slice(-MAX_DATA_POINTS))
            setDiskLoad(prev => [...prev, info.getDiskLoad()].slice(-MAX_DATA_POINTS))
            setGpuLoad(prev => [...prev, info.getGpuLoad()].slice(-MAX_DATA_POINTS))
        }

        // Initial fetch
        (window as any).api.sysinfo.handleGetAll()
            .then(processData)
            .catch((err: any) => console.error('Error getting initial System Info:', err))

        // Subscribe to live updates
        const unsubscribe = (window as any).api.sysinfo.handleOnUpdated(processData)

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe()
            }
        }
    }, [])

    const createChartData = (label: string, dataPoints: number[], color: string) => ({
        labels: dataPoints.map((_, i) => i.toString()),
        datasets: [
            {
                label,
                data: dataPoints,
                fill: true,
                borderColor: color,
                backgroundColor: `${color}20`,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            },
        ],
    })

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            x: { display: false },
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8', font: { size: 10 } }
            },
        },
        animation: { duration: 0 }
    }

    return (
        <main className="flex flex-col w-full px-6">
            <header className="mb-6 text-left">
                <h1 className="text-4xl font-extrabold m-0 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent tracking-tight">System Station</h1>
                <p className="text-[#94a3b8] text-base mt-2">Real-time resource monitor</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
                {/* CPU Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-teal-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="15" y1="2" x2="15" y2="4"></line><line x1="9" y1="2" x2="9" y2="4"></line><line x1="15" y1="20" x2="15" y2="22"></line><line x1="9" y1="20" x2="9" y2="22"></line><line x1="20" y1="15" x2="22" y2="15"></line><line x1="20" y1="9" x2="22" y2="9"></line><line x1="2" y1="15" x2="4" y2="15"></line><line x1="2" y1="9" x2="4" y2="9"></line></svg>
                        </div>
                        <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Processor</span>
                    </div>
                    <div className="text-3xl font-bold flex items-baseline gap-1">
                        {sysInfo ? sysInfo.getCpuLoad() : '0'}
                        <span className="text-sm font-medium text-[#94a3b8]">%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.3)] transition-[width] duration-1000 ease-out"
                            style={{ width: `${sysInfo ? sysInfo.getCpuLoad() : 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* Memory Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-purple-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 19v-3h12v3c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2z"></path><path d="M6 5c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v3H6V5z"></path><path d="M6 8v8h12V8H6z"></path><line x1="2" y1="7" x2="6" y2="7"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="2" y1="17" x2="6" y2="17"></line><line x1="18" y1="7" x2="22" y2="7"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="18" y1="17" x2="22" y2="17"></line></svg>
                        </div>
                        <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Memory</span>
                    </div>
                    <div className="text-3xl font-bold flex items-baseline gap-1">
                        {sysInfo ? sysInfo.getMemoryLoad() : '0'}
                        <span className="text-sm font-medium text-[#94a3b8]">%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-[width] duration-1000 ease-out"
                            style={{ width: `${sysInfo ? sysInfo.getMemoryLoad() : 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* GPU Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-amber-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                        </div>
                        <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Graphics</span>
                    </div>
                    <div className="text-3xl font-bold flex items-baseline gap-1">
                        {sysInfo ? sysInfo.getGpuLoad() : '0'}
                        <span className="text-sm font-medium text-[#94a3b8]">%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-[width] duration-1000 ease-out"
                            style={{ width: `${sysInfo ? sysInfo.getGpuLoad() : 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* Disk Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-emerald-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"></path></svg>
                        </div>
                        <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Disk IO</span>
                    </div>
                    <div className="text-3xl font-bold flex items-baseline gap-1">
                        {sysInfo ? sysInfo.getDiskLoad() : '0'}
                        <span className="text-sm font-medium text-[#94a3b8]">KB/s</span>
                    </div>
                </div>
            </div>

            <hr className="border-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 w-full" />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full box-border transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="m-0 text-sm text-[#94a3b8] uppercase tracking-wider">CPU Load History</h3>
                        <span className="text-lg font-bold text-[#f8fafc]">{sysInfo?.getCpuLoad()}%</span>
                    </div>
                    <div className="h-[200px] w-full">
                        <Line data={createChartData('CPU', cpuLoad, '#2dd4bf')} options={chartOptions} />
                    </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full box-border transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="m-0 text-sm text-[#94a3b8] uppercase tracking-wider">Memory Usage History</h3>
                        <span className="text-lg font-bold text-[#f8fafc]">{sysInfo?.getMemoryLoad()}%</span>
                    </div>
                    <div className="h-[200px] w-full">
                        <Line data={createChartData('Memory', memLoad, '#a855f7')} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full box-border transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="m-0 text-sm text-[#94a3b8] uppercase tracking-wider">Graphics Load History</h3>
                        <span className="text-lg font-bold text-[#f8fafc]">{sysInfo?.getGpuLoad()}%</span>
                    </div>
                    <div className="h-[200px] w-full">
                        <Line data={createChartData('GPU', gpuLoad, '#f59e0b')} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full box-border transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="m-0 text-sm text-[#94a3b8] uppercase tracking-wider">Disk IO History</h3>
                        <span className="text-lg font-bold text-[#f8fafc]">{sysInfo?.getDiskLoad()} KB/s</span>
                    </div>
                    <div className="h-[200px] w-full">
                        <Line data={createChartData('Disk', diskLoad, '#10b981')} options={chartOptions} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Dashboard
