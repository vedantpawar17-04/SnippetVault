import api from '../api/axios';
const API_URL = '/snippets';

export const getSnippets = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getSnippet = async (id: string) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const createSnippet = async (snippetData: any) => {
  const response = await api.post(API_URL, snippetData);
  return response.data;
};

export const updateSnippet = async (id: string, snippetData: any) => {
  const response = await api.put(`${API_URL}/${id}`, snippetData);
  return response.data;
};


export const deleteSnippet = async (id: string) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

export const createUpdatedSnippet = async (originalSnippetId: string, snippetData: any) => {
  const response = await api.post('/updated-snippets', { ...snippetData, originalSnippetId });
  return response.data;
};

export const getSimilarSnippets = async (id: string) => {
  const response = await api.get(`${API_URL}/${id}/similar`);
  return response.data;
};
