import { HashRouter, Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'sileo'
import MainLayout from './MainLayout'
import Dashboard from './views/Dashboard'
import { frontendModules } from '../registry/modules'

function App() {
    return (
        <>
            <Toaster position="bottom-right" />
            <HashRouter>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        {frontendModules.map((mod) => (
                            <Route
                                key={mod.id}
                                path={mod.route}
                                element={<mod.component />}
                            />
                        ))}
                    </Routes>
                </MainLayout>
            </HashRouter>
        </>
    )
}

export default App
