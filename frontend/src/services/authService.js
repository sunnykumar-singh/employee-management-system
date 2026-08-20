import api from './api.js';
import { unwrapItem } from '../utils/mappers.js';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return unwrapItem(data);
};

export const updateProfile = async (profile) => {
  const { data } = await api.put('/users/me', profile);
  return unwrapItem(data);
};

export const changePassword = async (passwords) => {
  const { data } = await api.put('/users/me/password', passwords);
  return unwrapItem(data);
};

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/users/me/photo', formData);
  return unwrapItem(data);
};
