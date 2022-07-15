import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {createOutbounds, getDeliveries, createStock, updateStock} from '../services/delivery.service';

const initialState = {
    inbounds: [],
    outbounds: [],
    stock: []
};

//User functions
export const getDeliveriesAsync = createAsyncThunk(
    'delivery/getOutbounds',
    async (data) => {
        return await getDeliveries(data.index, data.type);
    }
);

export const createOutboundAsync = createAsyncThunk(
    'delivery/createOutbound',
    async (data) => {
        return await createOutbounds(data);
    }
);

// Shop functions
export const getShopDeliveriesAsync = createAsyncThunk(
    'delivery/getShopStock',
    async (data) => {
        return await getDeliveries(data.index, data.type);
    }
);

export const createStockAsync = createAsyncThunk(
    'delivery/createOutbound',
    async (data) => {
        return await createStock(data);
    }
);

export const updateStockAsync = createAsyncThunk(
    'delivery/updateOutbound',
    async (data) => {
        return await updateStock(data);
    }
);

export const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDeliveriesAsync.fulfilled, (state, action) => {
                let outboundCopy = [...state.outbounds, ...action.payload.outbound].reverse();
                let inboundCopy = [...state.inbounds, ...action.payload.inbound].reverse();
                return {...state, outbounds: outboundCopy, inbounds: inboundCopy}
            })
            .addCase(getShopDeliveriesAsync.fulfilled, (state, action) => {
                let stockCopy = [...state.stock, ...action.payload.stock].reverse();
                return {...state, stock: stockCopy}
            })
            .addCase(createStockAsync.fulfilled, (state, action) => {
                let stockCopy = [...[action.payload], ...state.stock];
                return {...state, stock: stockCopy}
            })
            .addCase(updateStockAsync.fulfilled, (state, action) => {
                return {
                    ...state,
                    stock: state.stock.map(
                        (elem, i) => elem._id === action.payload.documentId ? {...elem, ...{status: "Picked Up", timePickedUp: new Date().getTime() / 1000}} : elem
                    )
                }
            })
    },
});

export const {} = deliverySlice.actions;

export const selectOutbounds = (state) => state.delivery.outbounds;
export const selectInbounds = (state) => state.delivery.inbounds;
export const selectStock = (state) => state.delivery.stock;

export default deliverySlice.reducer;
