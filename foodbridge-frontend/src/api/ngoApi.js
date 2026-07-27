import api from './axios';

export const ngoApi = {
  getProfile: () => api.get('/ngos/profile/'),
  uploadDocs: (data) => api.put('/ngos/verification-docs/', data),
  claimDonation: (donationId) => api.post(`/claims/${donationId}/`),
};
