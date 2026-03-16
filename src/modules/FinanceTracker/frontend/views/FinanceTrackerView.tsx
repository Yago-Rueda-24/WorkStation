import { useState } from 'react';
import { FinanceView } from '../types/finance.types';
import FinanceNavBar from '../components/shared/FinanceNavBar';
import FinanceDashboard from './FinanceDashboard';
import CarterasView from './CarterasView';
import CuentasView from './CuentasView';
import InversionesView from './InversionesView';

const ComingSoon = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 text-slate-600">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M9 12h6M12 9v6" />
        </svg>
        <p className="text-sm font-medium">{label} — próximamente</p>
    </div>
);

const FinanceTrackerView = () => {
    const [activeView, setActiveView] = useState<FinanceView>('dashboard');

    return (
        <div className="flex flex-col h-full">
            <FinanceNavBar activeView={activeView} onNavigate={setActiveView} />

            <div className="flex-1 min-h-0 overflow-y-auto">
                {activeView === 'dashboard' && <FinanceDashboard />}
                {activeView === 'carteras' && <CarterasView />}
                {activeView === 'cuentas' && <CuentasView />}
                {activeView === 'inversiones' && <InversionesView />}
            </div>

        </div>
    );
};

export default FinanceTrackerView;
