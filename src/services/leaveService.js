import api from './api.js';
import { unwrapItem, unwrapPage } from '../utils/mappers.js';

export const listLeaves = async (params) => {
  const { data } = await api.get('/leaves', { params });
  return unwrapPage(data);
};

export const createLeave = async (payload) => {
  const { data } = await api.post('/leaves', payload);
  return unwrapItem(data);
};

export const updateLeave = async (id, payload) => {
  const { data } = await api.put(`/leaves/${id}`, payload);
  return unwrapItem(data);
};

export const deleteLeave = async (id) => {
  const { data } = await api.delete(`/leaves/${id}`);
  return unwrapItem(data);
};

export const approveLeave = async (id, remarks) => {
  const { data } = await api.post(`/leaves/${id}/approve`, remarks ? { remarks } : {});
  return unwrapItem(data);
};

export const rejectLeave = async (id, remarks) => {
  const { data } = await api.post(`/leaves/${id}/reject`, remarks ? { remarks } : {});
  return unwrapItem(data);
};
