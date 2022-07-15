import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {searchByName} from '../services/user.service';

const initialState = {

};

export const getUserByName = createAsyncThunk(
    'user/getUser',
    async (userName) => {
        return await searchByName(userName);
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserByName.fulfilled, (state, action) => {
                console.log('loaded successfully');
            })
    },
});

export default userSlice.reducer;
