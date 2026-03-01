import { ReactNode } from 'react'
import TitleBar from './TitleBar'

interface MainLayoutProps {
    children?: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex flex-col h-screen pt-[calc(35px+1.5rem)] pb-6 w-full box-border bg-[#0d1117] text-[#f8fafc] font-sans selection:bg-teal-500/30">
            <style>
                {`
                body {
                    background-image: 
                        radial-gradient(circle at 10% 20%, rgba(45, 212, 191, 0.05) 0%, transparent 40%),
                        radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 40%);
                }
                `}
            </style>
            <TitleBar />
            <div className="flex flex-col flex-1 min-h-0">
                {children}
            </div>
        </div>
    )
}

export default MainLayout
