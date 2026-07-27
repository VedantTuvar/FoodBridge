import api from './axios';

export const analyticsApi = {
  getUserImpact: () => api.get('/analytics/user/'),
  getGlobalImpact: () => api.get('/analytics/global/'),
};
