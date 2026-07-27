import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isSidebarOpen: boolean;
  toastMessage: string | null;
}

const initialState: UIState = {
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
    setToast: (state, action: PayloadAction<string | null>) => {
      state.toastMessage = action.payload;
    },
  },
});

export const { toggleSidebar, setToast } = uiSlice.actions;
export default uiSlice.reducer;
