import api from './axios';

export const taskApi = {
  getNearbyTasks: () => api.get('/tasks/nearby/'),
  acceptTask: (taskId) => api.patch(`/tasks/${taskId}/accept/`),
  updateStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status/`, { status }),
  uploadProof: (taskId, data) => api.patch(`/tasks/${taskId}/proof/`, data),
};
