import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {login, logout, signup, forgot, signupShop} from '../services/auth.service';

const initialState = {
    loggedIn: localStorage.getItem("loggedIn") === 'true',
    userType: localStorage.getItem("type"),
};

export const loginAsync = createAsyncThunk(
    'auth/login',
    async (credentials) => {
        return await login(credentials);
    }
);

export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async () => {
        return await logout();
    }
);

export const signupAsync = createAsyncThunk(
    'auth/signup',
    async (signupData) => {
        return signup(signupData);
    }
);

export const signupShopAsync = createAsyncThunk(
    'auth/signup/shop',
    async (signupData) => {
        return signupShop(signupData);
    }
);

export const forgotAsync = createAsyncThunk(
    'auth/forgot',
    async (forgotData) => {
        return await forgot(forgotData);
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setUserType: (state, action) => {
            state.userType = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.fulfilled, (state, action) => {
                console.log('loaded');
            })
            .addCase(logoutAsync.fulfilled, (state, action) => {
                console.log('loaded logout');
            })
            .addCase(signupAsync.fulfilled, (state, action) => {
                console.log('loaded signup');
            })
            .addCase(forgotAsync.fulfilled, (state, action) => {
                console.log('loaded forgot');
            });
    }
});

export const {setLoggedIn, setMessage, setUserType} = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.loggedIn;
export const selectUserType = (state) => state.auth.userType;

export default authSlice.reducer;
