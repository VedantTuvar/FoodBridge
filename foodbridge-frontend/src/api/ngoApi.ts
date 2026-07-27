import api from './axios';

export const ngoApi = {
  getProfile: () => api.get('/ngos/profile/'),
  updateProfile: (data: any) => api.put('/ngos/profile/', data),
  
  uploadVerificationDocument: (formData: FormData) =>
    api.post('/ngos/upload-verification/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    
  claimDonation: (donationId: string) => api.post('/claims/', { donation_id: donationId }),
  getClaimHistory: () => api.get('/claims/'),
  
  getFoodRequests: () => api.get('/ngos/food-requests/'),
  createFoodRequest: (data: any) => api.post('/ngos/food-requests/', data),
  deleteFoodRequest: (id: string) => api.delete(`/ngos/food-requests/${id}/`),
  
  getAnalytics: () => api.get('/ngos/analytics/'),
};
