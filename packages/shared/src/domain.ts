import {z} from 'zod';

export const equipmentStatusSchema =
    z.enum(['ACTIVE', 'DEPRECATED', 'PHASED_OUT']);
export type EquipmentStatus = z.infer<typeof equipmentStatusSchema>;

export const repairStatusSchema =
    z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']);
export type RepairStatus = z.infer<typeof repairStatusSchema>;

export const severitySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type Severity = z.infer<typeof severitySchema>;

export const equipmentBaseSchema = z.object({
  name: z.string().min(2).max(120),
  model: z.string().min(2).max(80),
  serialNumber: z.string().min(2).max(80),
  location: z.string().min(2).max(120),
  status: equipmentStatusSchema.default('ACTIVE')
});

export const componentBaseSchema = z.object({
  name: z.string().min(2).max(120),
  pcbReference: z.string().min(2).max(80),
  partNumber: z.string().min(2).max(80).optional()
});

export const failureCreateSchema = z.object({
  equipmentId: z.string().uuid(),
  componentId: z.string().uuid().optional(),
  severity: severitySchema,
  symptoms: z.string().min(2).max(300),
  description: z.string().min(2).max(1000)
});

export const repairCreateSchema = z.object({
  failureId: z.string().uuid(),
  technician: z.string().min(2).max(120),
  notes: z.string().min(2).max(1000),
  status: repairStatusSchema.default('PENDING')
});

export const repairUpdateSchema = z.object({
  status: repairStatusSchema.optional(),
  notes: z.string().min(2).max(1000).optional(),
  rootCause: z.string().min(2).max(500).optional(),
  correctiveAction: z.string().min(2).max(500).optional()
});

export const testReadingCreateSchema = z.object({
  repairId: z.string().uuid(),
  metric: z.string().min(2).max(120),
  value: z.number(),
  unit: z.string().min(1).max(20),
  passed: z.boolean()
});

export const recommendationSchema = z.object({
  equipmentId: z.string().uuid(),
  recommendation: z.enum(['REPAIR', 'REPLACE', 'MONITOR']),
  reason: z.string(),
  failureRate: z.number(),
  repairSuccessRate: z.number()
});

export type EquipmentCreateInput = z.infer<typeof equipmentBaseSchema>;
export type ComponentInput = z.infer<typeof componentBaseSchema>;
export type FailureCreateInput = z.infer<typeof failureCreateSchema>;
export type RepairCreateInput = z.infer<typeof repairCreateSchema>;
export type RepairUpdateInput = z.infer<typeof repairUpdateSchema>;
export type TestReadingCreateInput = z.infer<typeof testReadingCreateSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;