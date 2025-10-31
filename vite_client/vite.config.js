export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: '/', // ensures correct asset URLs for static hosting
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // only for local dev
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
