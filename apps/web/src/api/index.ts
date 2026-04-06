import type {AnalyticsResponse, AuthResponse, Equipment, EquipmentCreateInput, FailureCreateInput, RepairCreateInput, RepairUpdateInput} from '../types/api';

import {api} from './client';

export const login = async (username: string, password: string) => {
  const {data} =
      await api.post<AuthResponse>('/auth/login', {username, password});
  return data;
};

export const listEquipment = async () => {
  const {data} = await api.get<Equipment[]>('/equipment');
  return data;
};

export const getEquipment = async (id: string) => {
  const {data} = await api.get<Equipment>(`/equipment/${id}`);
  return data;
};

export const createEquipment = async (input: EquipmentCreateInput) => {
  const {data} = await api.post<Equipment>('/equipment', input);
  return data;
};

export const createFailure = async (input: FailureCreateInput) => {
  const {data} = await api.post('/failures', input);
  return data;
};

export const listFailures = async (equipmentId?: string) => {
  const {data} = await api.get('/failures', {params: {equipmentId}});
  return data;
};

export const createRepair = async (input: RepairCreateInput) => {
  const {data} = await api.post('/repairs', input);
  return data;
};

export const updateRepair =
    async (repairId: string, input: RepairUpdateInput) => {
  const {data} = await api.patch(`/repairs/${repairId}`, input);
  return data;
};

export const addRepairReading = async (
    repairId: string,
    input: {metric: string; value: number; unit: string; passed: boolean}) => {
  const {data} = await api.post(`/repairs/${repairId}/readings`, input);
  return data;
};

export const getAnalytics = async () => {
  const {data} = await api.get<AnalyticsResponse>('/analytics');
  return data;
};