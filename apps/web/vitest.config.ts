import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/components/StatCard.tsx', 'src/components/SimpleBarChart.tsx',
        'src/components/AuthPanel.tsx'
      ],
      thresholds: {lines: 100, functions: 100, branches: 100, statements: 100}
    }
  }
});