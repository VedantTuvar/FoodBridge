import api from './axios';

export const ngoApi = {
  getProfile: () => api.get('/ngos/profile/'),
  updateProfile: (data: any) => api.put('/ngos/profile/', data),
  uploadDocs: (data: any) => api.put('/ngos/verification-docs/', data),
  uploadVerificationDocument: (data: any) => api.put('/ngos/verification-docs/', data),
  claimDonation: (donationId: string) => api.post(`/claims/${donationId}/`),
  getClaimHistory: () => api.get('/ngos/claims/history/'),
  getFoodRequests: () => api.get('/ngos/food-requests/'),
  createFoodRequest: (data: any) => api.post('/ngos/food-requests/', data),
  deleteFoodRequest: (id: string) => api.delete(`/ngos/food-requests/${id}/`),
  getAnalytics: () => api.get('/analytics/ngo/'),
};
