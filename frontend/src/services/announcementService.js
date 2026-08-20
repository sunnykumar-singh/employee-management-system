import api from './api.js';
import { unwrapItem, unwrapPage } from '../utils/mappers.js';

export const listAnnouncements = async (params) => {
  const { data } = await api.get('/announcements', { params });
  return unwrapPage(data);
};

export const createAnnouncement = async (payload) => {
  const { data } = await api.post('/announcements', payload);
  return unwrapItem(data);
};

export const updateAnnouncement = async (id, payload) => {
  const { data } = await api.put(`/announcements/${id}`, payload);
  return unwrapItem(data);
};

export const deleteAnnouncement = async (id) => {
  const { data } = await api.delete(`/announcements/${id}`);
  return unwrapItem(data);
};
