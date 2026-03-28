import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../models/types';

type CategoriesState = {
    items: Category[];
};

const initialState: CategoriesState = {
    items: [
        { id: '1', name: 'Jedzenie', type: 'expense', color: '#ef4444' },
        { id: '2', name: 'Transport', type: 'expense', color: '#3b82f6' },
        { id: '3', name: 'Rachunki', type: 'expense', color: '#f59e0b' },
    ],
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: {
            reducer: (state, action: PayloadAction<Category>) => {
                state.items.push(action.payload);
            },
            prepare: (name: string) => ({
                payload: {
                    id: Date.now().toString(),
                    name,
                    type: 'expense' as const,
                    color: '#6366f1',
                },
            }),
        },
        removeCategory: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(category => category.id !== action.payload);
        },
    },
});

export const { addCategory, removeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;