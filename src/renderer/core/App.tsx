import { HashRouter, Routes, Route, Navigate } from 'react-router'
import MainLayout from './MainLayout'
import Dashboard from '../sysinfo/views/Dashboard'
import Settings from '../settings/views/Settings'

function App() {
    return (
        <HashRouter>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </MainLayout>
        </HashRouter>
    )
}

export default App
