import api from './axios';

export const donationApi = {
  getDonations: () => api.get('/donations/'),
  getDonationById: (id: string) => api.get(`/donations/${id}/`),
  createDonation: (data: any) => api.post('/donations/', data),
  cancelDonation: (id: string) => api.patch(`/donations/${id}/cancel/`),
};
