import {PrismaPg} from '@prisma/adapter-pg';
import {EquipmentStatus, PrismaClient, RepairStatus, Severity} from '@prisma/client';
import {pathToFileURL} from 'node:url';

const connectionString = process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/rimdp';
const adapter = new PrismaPg({connectionString});
export const prisma = new PrismaClient({adapter});

export const seed = async () => {
  await prisma.testReading.deleteMany();
  await prisma.repair.deleteMany();
  await prisma.failure.deleteMany();
  await prisma.component.deleteMany();
  await prisma.equipment.deleteMany();

  const pressureSensor = await prisma.equipment.create({
    data: {
      name: 'Pressure Sensor Array - Line A',
      model: 'PSA-440',
      serialNumber: 'PSA440-2026-001',
      location: 'Plant 1 / Compressor Bay',
      status: EquipmentStatus.ACTIVE,
      components: {
        create: [
          {name: 'Main PCB', pcbReference: 'PCB-A1', partNumber: 'MPCB-11'}, {
            name: 'Signal Conditioning PCB',
            pcbReference: 'PCB-B3',
            partNumber: 'SCB-42'
          },
          {
            name: 'Power Regulation PCB',
            pcbReference: 'PCB-P2',
            partNumber: 'PRB-09'
          }
        ]
      }
    },
    include: {components: true}
  });

  const signalBoard =
      pressureSensor.components.find((c) => c.pcbReference === 'PCB-B3');
  const powerBoard =
      pressureSensor.components.find((c) => c.pcbReference === 'PCB-P2');

  if (!signalBoard || !powerBoard) {
    throw new Error('Seed component resolution failed');
  }

  const failure1 = await prisma.failure.create({
    data: {
      equipmentId: pressureSensor.id,
      componentId: signalBoard.id,
      severity: Severity.HIGH,
      symptoms: 'Intermittent pressure spikes',
      description:
          'Telemetry shows sudden spikes every 8-12 minutes under normal load.'
    }
  });

  const failure2 = await prisma.failure.create({
    data: {
      equipmentId: pressureSensor.id,
      componentId: signalBoard.id,
      severity: Severity.CRITICAL,
      symptoms: 'Signal dropout',
      description:
          'Pressure reading drops to zero briefly during compressor surge cycles.'
    }
  });

  const failure3 = await prisma.failure.create({
    data: {
      equipmentId: pressureSensor.id,
      componentId: powerBoard.id,
      severity: Severity.MEDIUM,
      symptoms: 'Thermal drift',
      description: 'Measured output drifts above +2% when ambient exceeds 55°C.'
    }
  });

  const repair1 = await prisma.repair.create({
    data: {
      failureId: failure1.id,
      technician: 'A. Patel',
      notes:
          'Reflowed suspect solder joints on ADC path; replaced filter capacitor C23.',
      status: RepairStatus.COMPLETED,
      rootCause: 'Cold solder joint on signal conditioning path',
      correctiveAction: 'Solder rework and capacitor replacement',
      completedAt: new Date()
    }
  });

  const repair2 = await prisma.repair.create({
    data: {
      failureId: failure2.id,
      technician: 'R. Gomez',
      notes: 'Replaced op-amp U7 and revalidated gain calibration.',
      status: RepairStatus.FAILED,
      rootCause: 'Component degradation plus intermittent connector issue',
      correctiveAction: 'Op-amp swap, pending harness replacement',
      completedAt: new Date()
    }
  });

  const repair3 = await prisma.repair.create({
    data: {
      failureId: failure3.id,
      technician: 'L. Chen',
      notes:
          'Applied heat sink pad and adjusted regulator compensation network.',
      status: RepairStatus.IN_PROGRESS,
      rootCause: 'Thermal stress around power regulation stage',
      correctiveAction: 'Thermal mitigation and tuning'
    }
  });

  await prisma.testReading.createMany({
    data: [
      {
        repairId: repair1.id,
        metric: 'Pressure Stability',
        value: 0.98,
        unit: 'score',
        passed: true
      },
      {
        repairId: repair1.id,
        metric: 'Noise Floor',
        value: 0.12,
        unit: 'mV',
        passed: true
      },
      {
        repairId: repair2.id,
        metric: 'Dropout Frequency',
        value: 6,
        unit: 'events/hr',
        passed: false
      },
      {
        repairId: repair3.id,
        metric: 'Thermal Drift',
        value: 1.6,
        unit: '%',
        passed: true
      }
    ]
  });
};

const runCliSeed = async () => {
  try {
    await seed();
    console.log('RIMDP seed completed');
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

const executedFileUrl =
    process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

if (executedFileUrl && import.meta.url === executedFileUrl) {
  void runCliSeed();
}