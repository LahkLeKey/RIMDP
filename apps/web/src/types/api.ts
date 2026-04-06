import type {AnalyticsResponse, EquipmentCreateInput, FailureCreateInput, RepairCreateInput, RepairUpdateInput} from '@rimdp/shared';

export type Equipment = {
  id: string; name: string; model: string; serialNumber: string;
  location: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'PHASED_OUT';
  components: Array<{
    id: string; name: string; pcbReference: string;
    partNumber?: string | null;
  }>;
  failures: Array<{
    id: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    symptoms: string;
    description: string;
    occurredAt: string;
    repairs: Array<{
      id: string; status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      technician: string;
      notes: string;
      startedAt: string;
      completedAt?: string | null;
    }>;
  }>;
};

export type AuthResponse = {
  token: string;
};

export type {
  AnalyticsResponse,
  EquipmentCreateInput,
  FailureCreateInput,
  RepairCreateInput,
  RepairUpdateInput
};