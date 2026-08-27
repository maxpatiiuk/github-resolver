/// <reference types="vitest/config" />

import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    minify: false,
    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
      fileName: 'main',
    },
    rolldownOptions: {
      external: builtinModules.flatMap((module) => [module, `node:${module}`]),
    },
  },
  test: {
    clearMocks: true,
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
    setupFiles: ['./__tests__/setup.ts'],
  },
});
