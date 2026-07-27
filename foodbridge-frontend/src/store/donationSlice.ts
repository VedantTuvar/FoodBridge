import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Donation } from '../types';

interface DonationState {
  donations: Donation[];
  selectedDonation: Donation | null;
  loading: boolean;
}

const initialState: DonationState = {
  donations: [],
  selectedDonation: null,
  loading: false,
};

const donationSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    setDonations: (state, action: PayloadAction<Donation[]>) => {
      state.donations = action.payload;
    },
    setSelectedDonation: (state, action: PayloadAction<Donation | null>) => {
      state.selectedDonation = action.payload;
    },
    addDonation: (state, action: PayloadAction<Donation>) => {
      state.donations.unshift(action.payload);
    },
  },
});

export const { setDonations, setSelectedDonation, addDonation } = donationSlice.actions;
export default donationSlice.reducer;
