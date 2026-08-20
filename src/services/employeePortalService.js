import api from './api.js';
import { unwrapItem, unwrapPage } from '../utils/mappers.js';

export const getEmployeeDashboard = async () => {
  const { data } = await api.get('/employee/dashboard');
  return unwrapItem(data);
};

export const listMyAttendance = async (params) => {
  const { data } = await api.get('/employee/attendance', { params });
  return unwrapPage(data);
};

export const checkInAttendance = async () => {
  const { data } = await api.post('/employee/attendance/check-in');
  return unwrapItem(data);
};

export const checkOutAttendance = async () => {
  const { data } = await api.post('/employee/attendance/check-out');
  return unwrapItem(data);
};

export const listMyLeaves = async (params) => {
  const { data } = await api.get('/employee/leaves', { params });
  return unwrapPage(data);
};

export const applyLeave = async (payload) => {
  const { data } = await api.post('/employee/leaves', payload);
  return unwrapItem(data);
};

export const cancelLeave = async (id) => {
  const { data } = await api.delete(`/employee/leaves/${id}`);
  return unwrapItem(data);
};

export const listMyAnnouncements = async (params) => {
  const { data } = await api.get('/employee/announcements', { params });
  return unwrapPage(data);
};
