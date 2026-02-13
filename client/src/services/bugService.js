import api from './api.js';

export const bugService = {
  createBug: async (title, description, bountyAmount) => {
    const response = await api.post('/bugs', { title, description, bountyAmount });
    return response.data;
  },

  getBugs: async () => {
    const response = await api.get('/bugs');
    return response.data;
  },

  getBugById: async (id) => {
    const response = await api.get(`/bugs/${id}`);
    return response.data;
  }
};
