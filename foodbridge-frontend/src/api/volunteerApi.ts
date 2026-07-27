import api from './axios';

export const volunteerApi = {
  getProfile: () => api.get('/volunteers/profile/'),
  updateProfile: (data: any) => api.patch('/volunteers/profile/', data),
  toggleAvailability: (is_available: boolean) =>
    api.patch('/volunteers/availability/', { is_available }),
  getLeaderboard: () => api.get('/volunteers/leaderboard/'),
  getBadges: () => api.get('/volunteers/badges/'),
};
