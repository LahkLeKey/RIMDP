import {prisma, seed} from './seed.js';

const run = async () => {
  try {
    const tableCounts = {
      equipment: await prisma.equipment.count(),
      component: await prisma.component.count(),
      failure: await prisma.failure.count(),
      repair: await prisma.repair.count(),
      testReading: await prisma.testReading.count()
    };

    const emptyTables = Object.entries(tableCounts)
                            .filter(([, count]) => count === 0)
                            .map(([tableName]) => tableName);

    if (emptyTables.length === 0) {
      console.log(`Seed skipped: all tables already populated (${
          JSON.stringify(tableCounts)}).`);
      return;
    }

    console.log(`Detected empty tables [${
        emptyTables.join(', ')}]. Running full seed...`);
    await seed();
    console.log('Conditional seed completed for all tables.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

void run();
