import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Budget } from '../../../backend/models/Budget';
import { BudgetService } from '../../../backend/services/budgetService';

interface State {
    list: Budget[];
}

const initialState: State = {
    list: [],
};

export const loadBudgets = createAsyncThunk(
    'budgets/load',
    async () => {
        return await BudgetService.getAll();
    }
);

export const setBudget = createAsyncThunk(
    'budgets/set',
    async (b: Budget) => {
        await BudgetService.set(b);
        return b;
    }
);

const slice = createSlice({
    name: 'budgets',
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(loadBudgets.fulfilled, (s, a) => {
            s.list = a.payload;
        });

        b.addCase(setBudget.fulfilled, (s, a) => {
            const i = s.list.findIndex(x => x.month === a.payload.month);
            if (i !== -1) s.list[i] = a.payload;
            else s.list.push(a.payload);
        });
    },
});

export default slice.reducer;