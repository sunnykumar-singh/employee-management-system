import api from './api.js';
import { unwrapItem, unwrapPage } from '../utils/mappers.js';

export const listAttendance = async (params) => {
  const { data } = await api.get('/attendance', { params });
  return unwrapPage(data);
};

export const updateAttendance = async (id, payload) => {
  const { data } = await api.put(`/attendance/${id}`, payload);
  return unwrapItem(data);
};
