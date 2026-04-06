import {describe, expect, it} from 'vitest';

import {componentBaseSchema, equipmentBaseSchema, equipmentStatusSchema, failureCreateSchema, recommendationSchema, repairCreateSchema, repairStatusSchema, repairUpdateSchema, severitySchema, testReadingCreateSchema} from './domain';

describe('domain schemas', () => {
  it('validates status and severity enums', () => {
    expect(equipmentStatusSchema.parse('ACTIVE')).toBe('ACTIVE');
    expect(repairStatusSchema.parse('COMPLETED')).toBe('COMPLETED');
    expect(severitySchema.parse('CRITICAL')).toBe('CRITICAL');
  });

  it('applies defaults and validates base equipment input', () => {
    const parsed = equipmentBaseSchema.parse({
      name: 'Pressure Sensor Array',
      model: 'PSA-440',
      serialNumber: 'SN-100',
      location: 'Plant 1'
    });

    expect(parsed.status).toBe('ACTIVE');
    expect(
        () => equipmentBaseSchema.parse(
            {name: 'A', model: 'B', serialNumber: '1', location: 'X'}))
        .toThrow();
  });

  it('validates component and failure payloads', () => {
    const component = componentBaseSchema.parse(
        {name: 'Main PCB', pcbReference: 'PCB-A1', partNumber: 'MPCB-11'});

    expect(component.partNumber).toBe('MPCB-11');

    const failure = failureCreateSchema.parse({
      equipmentId: '11111111-1111-1111-1111-111111111111',
      componentId: '22222222-2222-2222-2222-222222222222',
      severity: 'HIGH',
      symptoms: 'Signal dropout',
      description: 'Drops to zero under surge conditions'
    });

    expect(failure.severity).toBe('HIGH');
    expect(() => failureCreateSchema.parse({
      equipmentId: 'not-uuid',
      severity: 'LOW',
      symptoms: 'ok',
      description: 'ok'
    })).toThrow();
  });

  it('validates repair and test reading payloads', () => {
    const repairCreate = repairCreateSchema.parse({
      failureId: '33333333-3333-3333-3333-333333333333',
      technician: 'A. Patel',
      notes: 'Checked board path'
    });

    expect(repairCreate.status).toBe('PENDING');

    const repairUpdate = repairUpdateSchema.parse({
      status: 'IN_PROGRESS',
      notes: 'Continuing diagnostics',
      rootCause: 'Intermittent connector',
      correctiveAction: 'Replace harness'
    });

    expect(repairUpdate.status).toBe('IN_PROGRESS');

    const reading = testReadingCreateSchema.parse({
      repairId: '44444444-4444-4444-4444-444444444444',
      metric: 'Noise Floor',
      value: 0.12,
      unit: 'mV',
      passed: true
    });

    expect(reading.passed).toBe(true);
  });

  it('validates recommendation output payload shape', () => {
    const rec = recommendationSchema.parse({
      equipmentId: '55555555-5555-5555-5555-555555555555',
      recommendation: 'MONITOR',
      reason: 'Gathering trend evidence',
      failureRate: 0.3,
      repairSuccessRate: 0.6
    });

    expect(rec.recommendation).toBe('MONITOR');
  });
});