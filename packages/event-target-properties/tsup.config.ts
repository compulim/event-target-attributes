import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'event-target-properties': './src/index.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true,
    target: 'esnext'
  }
]);
