import api from './axios';

export const ratingApi = {
  submitRating: (data: { task: string; score: number; comment?: string }) =>
    api.post('/ratings/', data),
  getRatings: () => api.get('/ratings/'),
};
