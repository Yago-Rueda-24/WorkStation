import { useState } from 'react';
import { FinanceView } from '../types/finance.types';
import FinanceNavBar from '../components/shared/FinanceNavBar';
import FinanceDashboard from './FinanceDashboard';
import CarterasView from './CarterasView';
import CuentasView from './CuentasView';
import InversionesView from './InversionesView';


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
