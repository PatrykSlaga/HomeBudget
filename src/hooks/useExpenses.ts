import { useEffect, useState } from 'react';
import { Expense } from '../models/Expense';
import { ExpenseService } from '../services/expenseService';

export const useExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        const data = await ExpenseService.getAll();
        setExpenses(data);
        setLoading(false);
    };

    const add = async (e: Expense) => {
        await ExpenseService.add(e);
        await load();
    };

    const update = async (e: Expense) => {
        await ExpenseService.update(e);
        await load();
    };

    const remove = async (id: string) => {
        await ExpenseService.delete(id);
        await load();
    };

    useEffect(() => {
        load();
    }, []);

    return { expenses, loading, add, update, remove };
};