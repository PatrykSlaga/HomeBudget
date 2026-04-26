import { configureStore } from '@reduxjs/toolkit';

import categoriesReducer from './slices/categoriesSlice';
import expensesReducer from './slices/expensesSlice';
import budgetsReducer from './slices/budgetsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        categories: categoriesReducer,
        expenses: expensesReducer,
        budgets: budgetsReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;