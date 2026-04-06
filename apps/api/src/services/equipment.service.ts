import type {PrismaClient} from '@prisma/client';
import type {EquipmentCreateInput, EquipmentStatus} from '@rimdp/shared';

type EquipmentUpdateInput = Partial<EquipmentCreateInput>;

type CreateEquipmentWithComponents = EquipmentCreateInput&{
  components?:
      Array<{name: string; pcbReference: string; partNumber?: string;}>;
};

export class EquipmentService {
  constructor(private readonly prisma: PrismaClient) {}

  list() {
    return this.prisma.equipment.findMany({
      include: {components: true, failures: {include: {repairs: true}}},
      orderBy: {createdAt: 'desc'}
    });
  }

  detail(id: string) {
    return this.prisma.equipment.findUnique({
      where: {id},
      include: {
        components: true,
        failures: {
          include: {
            repairs:
                {include: {testReadings: true}, orderBy: {startedAt: 'desc'}}
          },
          orderBy: {occurredAt: 'desc'}
        }
      }
    });
  }

  create(input: CreateEquipmentWithComponents) {
    const {components, ...equipment} = input;
    return this.prisma.equipment.create({
      data: {
        ...equipment,
        components: components ? {create: components} : undefined
      },
      include: {components: true}
    });
  }

  update(id: string, input: EquipmentUpdateInput) {
    return this.prisma.equipment.update({
      where: {id},
      data: {
        name: input.name,
        model: input.model,
        serialNumber: input.serialNumber,
        location: input.location,
        status: input.status as EquipmentStatus
      }
    });
  }

  remove(id: string) {
    return this.prisma.equipment.delete({where: {id}});
  }
}