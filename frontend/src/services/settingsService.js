import api from './api.js';
import { unwrapItem } from '../utils/mappers.js';

export const getSettings = async () => {
  const { data } = await api.get('/settings');
  return unwrapItem(data);
};

export const updateSettings = async (settings) => {
  const { data } = await api.put('/settings', settings);
  return unwrapItem(data);
};
