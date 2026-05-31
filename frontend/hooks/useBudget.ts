import { useEffect, useState } from 'react';
import { Budget } from '../../backend/models/Budget';
import { BudgetService } from '../../backend/services/budgetService';
import { useUser } from './useUser';

export const useBudget = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const { user } = useUser();

    const load = async () => {
        setBudgets(await BudgetService.getAll());
    };

    const setBudget = async (b: Budget) => {
        await BudgetService.set(b);
        await load();
    };

    useEffect(() => {
        load();
    }, [user?.currency]); // 🔥 REAGUJE NA ZMIANĘ WALUTY W MENU

    return { budgets, setBudget };
};