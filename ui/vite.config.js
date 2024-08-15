import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    eslint(),
    solidPlugin(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
