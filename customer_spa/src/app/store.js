import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import deliveryReducer from '../slice/deliverySlice';
import shopReducer from '../slice/shopSlice';
import userReducer from '../slice/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    delivery: deliveryReducer,
    shop: shopReducer,
    user: userReducer
  },
});
