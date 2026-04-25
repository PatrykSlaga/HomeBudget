import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { Expense } from '../models/Expense';

const selectExpenses = (state: RootState): Expense[] =>
    state.expenses.list;
export const selectTotalSpent = (state: RootState) =>
    state.expenses.list.reduce((sum, e) => sum + e.amount, 0);
// 📅 miesiąc
export const getExpensesByMonth = (month: string) =>
    createSelector([selectExpenses], (expenses: Expense[]) =>
        expenses.filter(e => e.expenseDate.startsWith(month))
    );

// 💰 suma
export const getTotalSpent = createSelector(
    [selectExpenses],
    (expenses: Expense[]) =>
        expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0)
);

