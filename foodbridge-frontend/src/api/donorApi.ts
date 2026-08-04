import api from './axios';
  
export const donorApi = {
  getProfile: () => api.get('/donors/profile/'),
  updateProfile: (data: any) => api.put('/donors/profile/', data),
  getSettings: () => api.get('/donors/settings/'),
  updateSettings: (data: any) => api.put('/donors/settings/', data),
  
  // Recurring Schedules
  getRecurringSchedules: () => api.get('/donations/recurring-schedules/'),
  createRecurringSchedule: (data: any) => api.post('/donations/recurring-schedules/', data),
  deleteRecurringSchedule: (id: string) => api.delete(`/donations/recurring-schedules/${id}/`),
  
  // Image Upload
  uploadDonationImage: (formData: FormData) => 
    api.post('/donations/upload-image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
  // Donation Management
  updateDonation: (id: string, data: any) => api.put(`/donations/${id}/`, data),
  deleteDonation: (id: string) => api.delete(`/donations/${id}/`),
};
