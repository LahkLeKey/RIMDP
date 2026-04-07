import type {PrismaClient} from '@prisma/client';
import type {RepairCreateInput, RepairUpdateInput, TestReadingCreateInput} from '@rimdp/shared';

export class RepairService {
  constructor(private readonly prisma: PrismaClient) {}

  list() {
    return this.prisma.repair.findMany({
      include: {failure: true, testReadings: true},
      orderBy: {startedAt: 'desc'}
    });
  }

  create(input: RepairCreateInput) {
    return this.prisma.repair.create({
      data: {
        failureId: input.failureId,
        technician: input.technician,
        notes: input.notes,
        status: input.status
      },
      include: {failure: true, testReadings: true}
    });
  }

  update(id: string, input: RepairUpdateInput) {
    return this.prisma.repair.update({
      where: {id},
      data: {
        status: input.status,
        notes: input.notes,
        rootCause: input.rootCause,
        correctiveAction: input.correctiveAction,
        completedAt: input.status === 'COMPLETED' || input.status === 'FAILED' ?
            new Date() :
            undefined
      },
      include: {failure: true, testReadings: true}
    });
  }

  addTestReading(input: TestReadingCreateInput) {
    return this.prisma.testReading.create({
      data: {
        repairId: input.repairId,
        metric: input.metric,
        value: input.value,
        unit: input.unit,
        passed: input.passed
      }
    });
  }
}