import type {PrismaClient} from '@prisma/client';
import type {FailureCreateInput} from '@rimdp/shared';

export class FailureService {
  constructor(private readonly prisma: PrismaClient) {}

  create(input: FailureCreateInput) {
    return this.prisma.failure.create({
      data: {
        equipmentId: input.equipmentId,
        componentId: input.componentId,
        severity: input.severity,
        symptoms: input.symptoms,
        description: input.description
      },
      include: {equipment: true, component: true, repairs: true}
    });
  }

  list(equipmentId?: string) {
    return this.prisma.failure.findMany({
      where: equipmentId ? {equipmentId} : undefined,
      include: {
        equipment: true,
        component: true,
        repairs: {include: {testReadings: true}, orderBy: {startedAt: 'desc'}}
      },
      orderBy: {occurredAt: 'desc'}
    });
  }
}