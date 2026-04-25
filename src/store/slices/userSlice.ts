import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../models/User';
import { UserService } from '../../services/userService';

interface State {
    user: User | null;
}

const initialState: State = {
    user: null,
};

export const loadUser = createAsyncThunk<User | null, void>(
    'user/load',
    async () => {
        return await UserService.get();
    }
);

export const saveUser = createAsyncThunk(
    'user/save',
    async (user: User) => {
        await UserService.save(user);
        return user;
    }
);

const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(loadUser.fulfilled, (s, a) => {
            s.user = a.payload;
        });

        b.addCase(saveUser.fulfilled, (s, a) => {
            s.user = a.payload;
        });
    },
});

export default slice.reducer;