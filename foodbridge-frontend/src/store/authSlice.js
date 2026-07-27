import { createSlice } from '@reduxjs/toolkit';

const getStoredToken = () => 
  localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || null;

const initialState = {
  user: null,
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, access_token, refresh_token, remember_me } = action.payload;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;

      const storage = remember_me !== false ? localStorage : sessionStorage;
      storage.setItem('access_token', access_token);
      storage.setItem('refresh_token', refresh_token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setAuth, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
