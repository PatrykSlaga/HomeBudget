import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Expense } from '../../../backend/models/Expense';
import { ExpenseService } from '../../../backend/services/expenseService';

interface State {
    list: Expense[];
}

const initialState: State = {
    list: [],
};

export const loadExpenses = createAsyncThunk(
    'expenses/load',
    async () => {
        return await ExpenseService.getAll();
    }
);

export const addExpense = createAsyncThunk(
    'expenses/add',
    async (e: Expense) => {
        await ExpenseService.add(e);
        return e;
    }
);

export const editExpense = createAsyncThunk(
    'expenses/edit',
    async (e: Expense) => {
        await ExpenseService.update(e);
        return e;
    }
);

export const deleteExpense = createAsyncThunk(
    'expenses/delete',
    async (id: string) => {
        await ExpenseService.delete(id);
        return id;
    }
);

const slice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(loadExpenses.fulfilled, (s, a) => {
            s.list = a.payload;
        });

        b.addCase(addExpense.fulfilled, (s, a) => {
            s.list.push(a.payload);
        });

        b.addCase(editExpense.fulfilled, (s, a) => {
            const i = s.list.findIndex(x => x.id === a.payload.id);
            if (i !== -1) s.list[i] = a.payload;
        });

        b.addCase(deleteExpense.fulfilled, (s, a) => {
            s.list = s.list.filter(x => x.id !== a.payload);
        });
    },
});

export default slice.reducer;