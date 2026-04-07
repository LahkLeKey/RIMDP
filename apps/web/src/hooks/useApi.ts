import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {addRepairReading, createFailure, createRepair, getAnalytics, getEquipment, listEquipment, listFailures, login, updateRepair} from '../api';
import {clearAuthSession} from '../state/authState';

export const useEquipmentList = () =>
    useQuery({queryKey: ['equipment'], queryFn: listEquipment});

export const useEquipmentDetail = (id?: string) => useQuery({
  queryKey: ['equipment', id],
  queryFn: () => getEquipment(id as string),
  enabled: Boolean(id)
});

export const useAnalytics = () =>
    useQuery({queryKey: ['analytics'], queryFn: getAnalytics});

export const useFailures = (equipmentId?: string) => useQuery({
  queryKey: ['failures', equipmentId],
  queryFn: () => listFailures(equipmentId)
});

export const useLogin = () => {
  return useMutation({
    mutationFn: ({username, password}: {username: string; password: string}) =>
        login(username, password)
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => null,
    onSuccess: () => {
      clearAuthSession(queryClient);
      queryClient.removeQueries({queryKey: ['equipment']});
      queryClient.removeQueries({queryKey: ['failures']});
      queryClient.removeQueries({queryKey: ['analytics']});
    }
  });
};

export const useCreateFailure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFailure,
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: ['equipment']});
      void queryClient.invalidateQueries({queryKey: ['analytics']});
    }
  });
};

export const useCreateRepair = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRepair,
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: ['equipment']});
      void queryClient.invalidateQueries({queryKey: ['analytics']});
    }
  });
};

export const useUpdateRepair = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({repairId, payload}: {
      repairId: string; payload: Parameters<typeof updateRepair>[1]
    }) => updateRepair(repairId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: ['equipment']});
      void queryClient.invalidateQueries({queryKey: ['analytics']});
    }
  });
};

export const useAddReading = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({repairId, payload}: {
      repairId: string;
      payload: {metric: string; value: number; unit: string; passed: boolean};
    }) => addRepairReading(repairId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: ['equipment']});
    }
  });
};