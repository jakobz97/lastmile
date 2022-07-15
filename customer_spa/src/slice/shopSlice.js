import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {searchByCity, searchShopById} from '../services/shop.service';

const initialState = {

};

export const getShopByCity = createAsyncThunk(
    'shop/getShops',
    async (city) => {
        return await searchByCity(city);
    }
);

export const getShop = createAsyncThunk(
    'shop/getShopsById',
    async (shopId) => {
        return await searchShopById(shopId);
    }
);

export const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getShopByCity.fulfilled, (state, action) => {
                console.log('loaded successfully');
            })
        /*
        .addCase(createOutboundAsync.fulfilled, (state, action) => {
            let outboundCopy = [...state.outbounds, ...action.payload];
            return {...state, outbounds: outboundCopy}
        })
        .addCase(removeOutboundAsync.fulfilled, (state, action) => {
        })
         */
    },
});

export default shopSlice.reducer;
