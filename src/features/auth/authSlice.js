import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'auth',
  initialState: {
    authenticated: false
  },
  reducers: {
    login: state => {
      state.authenticated = true;
    },
    logout: state => {
      state.authenticated = false;
    }
  }
});

export const { login } = slice.actions;

export const selectAuthenticated = state => state.auth.authenticated;

export default slice.reducer;
