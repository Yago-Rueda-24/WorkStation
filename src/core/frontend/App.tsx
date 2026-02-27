import { HashRouter, Routes, Route, Navigate } from 'react-router'
import MainLayout from './MainLayout'
import Dashboard from '../../modules/sysinfo/frontend/views/Dashboard'
import Settings from '../../modules/settings/frontend/views/Settings'
import TaskListView from '../../modules/TaksManager/frontend/views/TaskListView'

function App() {
    return (
        <HashRouter>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/tasks" element={<TaskListView />} />
                </Routes>
            </MainLayout>
        </HashRouter>
    )
}

export default App
