import api from './axios';

export const notificationApi = {
  getNotifications: () => api.get('/notifications/'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read/`),
  markAllAsRead: () => api.post('/notifications/read-all/'),
};
