import api from './api.js';

export const submissionService = {
  createSubmission: async (bugId, solutionDescription, proofUrl, proofType = 'url', proofFileName = null) => {
    const response = await api.post(`/bugs/${bugId}/submissions`, {
      solutionDescription,
      proofUrl,
      proofType,
      proofFileName
    });
    return response.data;
  },

  getSubmissions: async (bugId) => {
    const response = await api.get(`/bugs/${bugId}/submissions`);
    return response.data;
  },

  approveSubmission: async (submissionId) => {
    const response = await api.post(`/submissions/${submissionId}/approve`);
    return response.data;
  }
};
