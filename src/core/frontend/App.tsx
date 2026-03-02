import { HashRouter, Routes, Route, Navigate } from 'react-router'
import MainLayout from './MainLayout'
import Dashboard from '../../modules/sysinfo/frontend/views/Dashboard'
import Settings from '../../modules/settings/frontend/views/Settings'
import TaskManagerView from '../../modules/TaksManager/frontend/views/TaskManagerView'

function App() {
    return (
        <HashRouter>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/tasks" element={<TaskManagerView />} />
                </Routes>
            </MainLayout>
        </HashRouter>
    )
}

export default App
