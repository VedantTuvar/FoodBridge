import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import donationReducer from './donationSlice';
import taskReducer from './taskSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    donations: donationReducer,
    tasks: taskReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
