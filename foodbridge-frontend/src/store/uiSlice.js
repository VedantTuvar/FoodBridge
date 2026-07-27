import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: true,
  toastMessage: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setToast: (state, action) => {
      state.toastMessage = action.payload;
    },
  },
});

export const { toggleSidebar, setToast } = uiSlice.actions;
export default uiSlice.reducer;
