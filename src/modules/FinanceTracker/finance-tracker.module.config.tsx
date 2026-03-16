import FinanceTrackerView from './frontend/views/FinanceTrackerView';
import { BaseFrontendConfig } from '../../core/registry/types.frontend';

class FinanceTrackerConfig extends BaseFrontendConfig {
    id = 'finance-tracker';
    order = 1;
    title = 'Finance Tracker';
    description = 'Track your income, expenses and budgets with charts and summaries.';
    route = '/finance-tracker';
    color = 'text-green-400';
    shadow = 'hover:shadow-green-500/10';
    component = FinanceTrackerView;
    icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
    )
}

export const config = new FinanceTrackerConfig();
