import { createSlice } from '@reduxjs/toolkit';
import firebase from '../../firebase.js';

export const slice = createSlice({
  name: 'auth',
  initialState: {
    authenticated: false,
    error: false
  },
  reducers: {
    loginSuccess: state => {
      state.authenticated = true;
    },
    logout: state => {
      state.authenticated = false;
    },
    loginError: (state, action) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = false;
    }
  }
});

export const { loginSuccess, loginError, clearError } = slice.actions;

export const authenticateUser = (email, password) => async dispatch => {
  try {
    dispatch(clearError());
    await firebase.auth().signInWithEmailAndPassword(email, password);
    dispatch(loginSuccess());
  } catch (error) {
    dispatch(loginError(error.message));
  }
};

export const selectAuthenticated = state => state.auth.authenticated;

export default slice.reducer;
