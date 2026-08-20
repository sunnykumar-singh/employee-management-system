import api from './api.js';
import { unwrapItem, unwrapPage } from '../utils/mappers.js';

export const listDepartments = async (params) => {
  const { data } = await api.get('/departments', { params });
  return unwrapPage(data);
};

export const createDepartment = async (payload) => {
  const { data } = await api.post('/departments', payload);
  return unwrapItem(data);
};

export const updateDepartment = async (id, payload) => {
  const { data } = await api.put(`/departments/${id}`, payload);
  return unwrapItem(data);
};

export const uploadDepartmentPhoto = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/departments/${id}/photo`, formData);
  return unwrapItem(data);
};

export const deleteDepartment = async (id) => {
  const { data } = await api.delete(`/departments/${id}`);
  return unwrapItem(data);
};
