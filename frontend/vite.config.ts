import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 👇 важный фикс, если stompjs / buffer вызывают "Buffer is not defined"
      buffer: 'rollup-plugin-polyfill-node/polyfills/buffer-es6',
      process: 'rollup-plugin-polyfill-node/polyfills/process-es6',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),
      ],
    },
    // 👇 иногда нужен fallback для WebSocket в некоторых браузерах
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
