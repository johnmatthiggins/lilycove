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
    port: 3000,
    origin: 'http://127.0.0.1:3001',
  },
  build: {
    target: 'esnext',
  },
});
