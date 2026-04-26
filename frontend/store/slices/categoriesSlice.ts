import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Category } from '../../../backend/models/Category';
import { CategoryService } from '../../../backend/services/categoryService';

interface State {
    list: Category[];
}

const initialState: State = {
    list: [],
};

export const loadCategories = createAsyncThunk(
    'categories/load',
    async () => {
        return await CategoryService.getAll();
    }
);

const slice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: (s, a) => {
            s.list.push(a.payload);
        },
        editCategory: (s, a) => {
            const i = s.list.findIndex(x => x.id === a.payload.id);
            if (i !== -1) s.list[i] = a.payload;
        },
        deleteCategory: (s, a) => {
            s.list = s.list.filter(x => x.id !== a.payload);
        },
    },
    extraReducers: (b) => {
        b.addCase(loadCategories.fulfilled, (s, a) => {
            s.list = a.payload;
        });
    },
});

export const {
    addCategory,
    editCategory,
    deleteCategory,
} = slice.actions;

export default slice.reducer;