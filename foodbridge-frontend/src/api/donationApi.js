import api from './axios';

export const donationApi = {
  createDonation: (data) => api.post('/donations/', data),
  getDonations: () => api.get('/donations/'),
  getDonationById: (id) => api.get(`/donations/${id}/`),
  cancelDonation: (id) => api.patch(`/donations/${id}/cancel/`),
};
