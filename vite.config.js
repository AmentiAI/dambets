import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        game: './game.html',
        new: './new.html'
      }
    }
  }
});

