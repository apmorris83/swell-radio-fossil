import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import spendsReducer from '../features/spends/spendsSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    spends: spendsReducer
  }
});
