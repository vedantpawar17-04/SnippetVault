import api from '../api/axios';
const API_URL = '/auth';

export const register = async (userData: any) => {
  const response = await api.post(API_URL + '/signup', userData);
  if (response.data) {
    localStorage.setItem('token', response.data.token);
    // User data is also returned, you might want to store it or return it
  }
  return response.data;
};

export const login = async (userData: any) => {
  const response = await api.post(API_URL + '/login', userData);
  if (response.data) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
