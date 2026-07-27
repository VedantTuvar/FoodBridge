import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  donations: [],
  selectedDonation: null,
  loading: false,
};

const donationSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    setDonations: (state, action) => {
      state.donations = action.payload;
    },
    setSelectedDonation: (state, action) => {
      state.selectedDonation = action.payload;
    },
    addDonation: (state, action) => {
      state.donations.unshift(action.payload);
    },
  },
});

export const { setDonations, setSelectedDonation, addDonation } = donationSlice.actions;
export default donationSlice.reducer;
