import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const workspaceRoot = process.cwd();
const cacheDir = join(workspaceRoot, '.cache');
const markerPath = join(cacheDir, 'rimdp-db-init.json');
const envPath = join(workspaceRoot, '.env');
const envExamplePath = join(workspaceRoot, '.env.example');

const pnpmCmd = 'pnpm';

const run = (args) => {
  console.log(`> ${pnpmCmd} ${args.join(' ')}`);
  const result = spawnSync(pnpmCmd, args, {
    cwd: workspaceRoot,
    stdio: 'inherit',
    env: process.env,
    shell: true
  });

  if (result.error) {
    console.error(result.error);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const ensureEnvFile = () => {
  if (!existsSync(envPath) && existsSync(envExamplePath)) {
    copyFileSync(envExamplePath, envPath);
    console.log('Created .env from .env.example');
  }

  if (!process.env.DATABASE_URL && existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    const dbLine = envContent
      .split(/\r?\n/)
      .find((line) => line.trim().startsWith('DATABASE_URL='));

    if (dbLine) {
      const value = dbLine.slice('DATABASE_URL='.length).trim();
      if (value) {
        process.env.DATABASE_URL = value;
      }
    }
  }
};

mkdirSync(cacheDir, { recursive: true });
ensureEnvFile();

const runDbInit = () => {
  run([
    '--filter',
    '@rimdp/api',
    'exec',
    'prisma',
    'migrate',
    'deploy'
  ]);
  run([
    '--filter',
    '@rimdp/api',
    'exec',
    'tsx',
    'prisma/seed-if-empty.ts'
  ]);
};

if (existsSync(markerPath)) {
  console.log(
      'DB first-run init already completed. Applying migrations and conditional seed.');
  runDbInit();
  process.exit(0);
}

console.log('Running first-run DB init (migrate, conditional seed)...');
runDbInit();

writeFileSync(
  markerPath,
  JSON.stringify({ completedAt: new Date().toISOString() }, null, 2),
  'utf8'
);

console.log('DB first-run init completed.');