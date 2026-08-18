import api from './api.js';
import { unwrapItem, unwrapPage } from '../utils/mappers.js';

export const listEmployees = async (params) => {
  const { data } = await api.get('/employees', { params });
  return unwrapPage(data);
};

export const getEmployee = async (id) => {
  const { data } = await api.get(`/employees/${id}`);
  return unwrapItem(data);
};

export const createEmployee = async (payload) => {
  const { data } = await api.post('/employees', payload);
  return unwrapItem(data);
};

export const updateEmployee = async (id, payload) => {
  const { data } = await api.put(`/employees/${id}`, payload);
  return unwrapItem(data);
};

export const uploadEmployeePhoto = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/employees/${id}/photo`, formData);
  return unwrapItem(data);
};

export const deleteEmployee = async (id) => {
  const { data } = await api.delete(`/employees/${id}`);
  return unwrapItem(data);
};
