import api from './axios';

export const taskApi = {
  getNearbyTasks: () => api.get('/tasks/nearby/'),
  getActiveTask: () => api.get('/tasks/active/'),
  getTaskHistory: () => api.get('/tasks/history/'),
  acceptTask: (taskId) => api.patch(`/tasks/${taskId}/accept/`),
  rejectTask: (taskId, reason) => api.post(`/tasks/${taskId}/reject/`, { reason }),
  logLocation: (taskId, latitude, longitude) => api.post(`/tasks/${taskId}/location/`, { latitude, longitude }),
  updateStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status/`, { status }),
  uploadProof: (taskId, data) => api.patch(`/tasks/${taskId}/proof/`, data),
};

