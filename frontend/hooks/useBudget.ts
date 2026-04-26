import { useEffect, useState } from 'react';

import { Budget } from '../../backend/models/Budget';
import { BudgetService } from '../../backend/services/budgetService';

export const useBudget = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    const load = async () => {
        setBudgets(await BudgetService.getAll());
    };

    const setBudget = async (b: Budget) => {
        await BudgetService.set(b);
        await load();
    };

    useEffect(() => {
        load();
    }, []);

    return { budgets, setBudget };
};