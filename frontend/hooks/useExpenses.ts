import { useEffect, useState } from 'react';
import { Expense } from '../../backend/models/Expense';
import { ExpenseService } from '../../backend/services/expenseService';
import { useUser } from './useUser'; // Importujemy hook użytkownika

export const useExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUser(); // Pobieramy aktualny stan użytkownika

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
    }, [user?.currency]); // 🔥 REAGUJE NA ZMIANĘ WALUTY W MENU

    return { expenses, loading, add, update, remove };
};