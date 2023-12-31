import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import globalReducer from '../features/global/globalSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    global: globalReducer,
  },
});
